import type { QuizMode } from "./types";

const PROGRESS_KEY = "cg-progress-v1";
const SETTINGS_KEY = "cg-settings-v1";

export type WeekResult = {
  score: number;
  total: number;
  /** Epoch ms of the attempt. */
  at: number;
  /** Question ids answered wrong or skipped, for the "review wrong" retry. */
  wrongIds: string[];
};

export type Progress = Record<string, WeekResult>;

export type Settings = {
  mode: QuizMode;
  shuffle: boolean;
  timer: boolean;
  /** Minutes. */
  duration: number;
};

export const DEFAULT_SETTINGS: Settings = {
  mode: "practice",
  shuffle: false,
  timer: false,
  duration: 20,
};

const EMPTY_PROGRESS: Progress = {};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — progress is a convenience, never required */
  }
}

/*
 * Components read this through useSyncExternalStore, so the snapshots must be
 * referentially stable: cache them and only swap the reference on a write.
 */

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

let progressCache: Progress | null = null;

export function getProgress(): Progress {
  progressCache ??= read<Progress>(PROGRESS_KEY, EMPTY_PROGRESS);
  return progressCache;
}

/** Server and hydration render: nobody has a score yet. */
export function getProgressServerSnapshot(): Progress {
  return EMPTY_PROGRESS;
}

/** Keeps the best score for a week, but always stores the latest wrong list. */
export function saveResult(slug: string, result: WeekResult) {
  const previous = getProgress()[slug];
  const next: Progress = {
    ...getProgress(),
    [slug]: {
      ...result,
      score: previous ? Math.max(previous.score, result.score) : result.score,
    },
  };
  progressCache = next;
  write(PROGRESS_KEY, next);
  emit();
}

export function clearProgress() {
  progressCache = EMPTY_PROGRESS;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(PROGRESS_KEY);
    } catch {
      /* ignore */
    }
  }
  emit();
}

let settingsCache: Settings | null = null;

export function getSettings(): Settings {
  settingsCache ??= read<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  return settingsCache;
}

/** Server and hydration render: defaults, so shuffling never desyncs hydration. */
export function getSettingsServerSnapshot(): Settings {
  return DEFAULT_SETTINGS;
}

export function setSettings(next: Settings) {
  settingsCache = next;
  write(SETTINGS_KEY, next);
  emit();
}
