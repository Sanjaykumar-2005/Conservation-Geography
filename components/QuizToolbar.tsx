"use client";

import Link from "next/link";
import type { Settings } from "@/lib/progress";
import { cn, formatTime } from "@/lib/utils";

const DURATIONS = [10, 15, 20, 30, 45, 60];

function Pill({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "mono rounded-full border px-3 py-1 text-[11px] transition-colors",
        active
          ? "border-accent bg-accent/20 text-white"
          : "border-line bg-surface text-muted hover:border-accent/50 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

export default function QuizToolbar({
  title,
  answered,
  total,
  settings,
  onSettingsChange,
  remaining,
  submitted,
  scoreable,
  onSubmit,
}: {
  title: string;
  answered: number;
  total: number;
  settings: Settings;
  onSettingsChange: (next: Settings) => void;
  remaining: number | null;
  submitted: boolean;
  /** False when no answer key exists — hides scoring and timing controls. */
  scoreable: boolean;
  onSubmit: () => void;
}) {
  const lowTime = remaining !== null && remaining <= 60;

  return (
    <div className="sticky top-0 z-20 -mx-5 mb-6 border-b border-line bg-ink/90 px-5 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href="/"
          className="mono shrink-0 text-xs text-accent transition-opacity hover:opacity-80"
        >
          ← Weeks
        </Link>
        <span className="mono truncate text-sm font-bold">{title}</span>

        <span className="mono ml-auto text-xs text-muted">
          {answered}/{total} answered
        </span>

        {remaining !== null && (
          <span
            className={cn(
              "mono rounded border px-2 py-0.5 text-xs tabular-nums",
              lowTime
                ? "animate-pulse border-bad/60 bg-bad-dim/60 text-bad"
                : "border-line bg-surface text-muted",
            )}
            role="timer"
            aria-live="off"
          >
            {formatTime(remaining)}
          </span>
        )}

        {!submitted && scoreable && (
          <button
            type="button"
            onClick={onSubmit}
            className="mono rounded-lg bg-accent px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent-dim"
          >
            Submit
          </button>
        )}
      </div>

      {!submitted && !scoreable && (
        <div className="mx-auto mt-2.5 flex max-w-3xl flex-wrap items-center gap-2">
          <span className="mono mr-1 text-[11px] tracking-wider text-muted uppercase">
            Not scored
          </span>
          <Pill
            active={settings.shuffle}
            onClick={() => onSettingsChange({ ...settings, shuffle: !settings.shuffle })}
            title="Randomise question and option order"
          >
            Shuffle
          </Pill>
        </div>
      )}

      {!submitted && scoreable && (
        <div className="mx-auto mt-2.5 flex max-w-3xl flex-wrap items-center gap-2">
          <span className="mono mr-1 text-[11px] tracking-wider text-muted uppercase">
            Mode
          </span>
          <Pill
            active={settings.mode === "practice"}
            onClick={() => onSettingsChange({ ...settings, mode: "practice" })}
            title="Reveal the answer as soon as you pick one"
          >
            Practice
          </Pill>
          <Pill
            active={settings.mode === "exam"}
            onClick={() => onSettingsChange({ ...settings, mode: "exam" })}
            title="Hide answers until you submit"
          >
            Exam
          </Pill>

          <span className="mx-1 h-4 w-px bg-line" />

          <Pill
            active={settings.shuffle}
            onClick={() => onSettingsChange({ ...settings, shuffle: !settings.shuffle })}
            title="Randomise question and option order"
          >
            Shuffle
          </Pill>
          <Pill
            active={settings.timer}
            onClick={() => onSettingsChange({ ...settings, timer: !settings.timer })}
            title="Count down and auto-submit"
          >
            Timer
          </Pill>

          {settings.timer && (
            <select
              value={settings.duration}
              onChange={(e) =>
                onSettingsChange({ ...settings, duration: Number(e.target.value) })
              }
              aria-label="Timer duration in minutes"
              className="mono rounded-full border border-line bg-surface px-2 py-1 text-[11px] text-muted"
            >
              {DURATIONS.map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
