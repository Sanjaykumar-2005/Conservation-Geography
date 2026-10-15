"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Question } from "@/lib/types";
import {
  getSettings,
  getSettingsServerSnapshot,
  saveResult,
  setSettings,
  subscribe,
  type Settings,
} from "@/lib/progress";
import { isCorrect, isKeyed, isMultiSelect, shuffle } from "@/lib/utils";
import QuestionCard from "./QuestionCard";
import QuizToolbar from "./QuizToolbar";
import ScoreSummary from "./ScoreSummary";

type Props = {
  slug: string;
  title: string;
  note?: string;
  questions: Question[];
};

export default function QuizClient({ slug, title, note, questions }: Props) {
  // Settings live in localStorage. The server snapshot has shuffle off, so the
  // first render matches the server HTML and only re-shuffles after hydration.
  const settings = useSyncExternalStore(
    subscribe,
    getSettings,
    getSettingsServerSnapshot,
  );

  const [attempt, setAttempt] = useState(0);
  const [seed, setSeed] = useState(1);
  const [pool, setPool] = useState<Question[]>(questions);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; wrongIds: string[] } | null>(
    null,
  );

  const prepared = useMemo(() => {
    const useShuffle = settings.shuffle;
    const base = useShuffle ? shuffle(pool, seed) : pool;
    return base.map((q, i) => ({
      q,
      optionOrder: useShuffle
        ? shuffle(
            q.options.map((_, j) => j),
            seed + (i + 1) * 31,
          )
        : q.options.map((_, j) => j),
    }));
  }, [pool, seed, settings.shuffle]);

  /** Questions with no released key can be read but never scored. */
  const keyed = useMemo(() => prepared.filter(({ q }) => isKeyed(q)), [prepared]);
  const scoreable = keyed.length > 0;

  const submitQuiz = useCallback(
    (auto: boolean) => {
      if (submitted || !scoreable) return;

      const wrongIds: string[] = [];
      let score = 0;
      for (const { q } of keyed) {
        if (isCorrect(q, answers[q.id] ?? [])) score++;
        else wrongIds.push(q.id);
      }

      setResult({ score, wrongIds });
      setTimedOut(auto);
      setSubmitted(true);
      setRemaining(null);
      setRevealed(Object.fromEntries(keyed.map(({ q }) => [q.id, true])));
      saveResult(slug, {
        score,
        total: keyed.length,
        at: Date.now(),
        wrongIds,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [answers, keyed, scoreable, slug, submitted],
  );

  const submitRef = useRef(submitQuiz);
  useEffect(() => {
    submitRef.current = submitQuiz;
  });

  // (Re)arms whenever the timer settings or the attempt change. Reading the wall
  // clock rather than decrementing keeps it honest if the tab gets throttled.
  useEffect(() => {
    if (!settings.timer || submitted || !scoreable) {
      const clear = window.setTimeout(() => setRemaining(null), 0);
      return () => window.clearTimeout(clear);
    }

    const total = settings.duration * 60;
    const startedAt = Date.now();
    const tick = () => {
      const left = Math.max(0, total - Math.floor((Date.now() - startedAt) / 1000));
      setRemaining(left);
      if (left === 0) submitRef.current(true);
    };

    const first = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 500);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [attempt, scoreable, settings.duration, settings.timer, submitted]);

  function toggleOption(q: Question, optionIndex: number) {
    if (submitted || revealed[q.id]) return;
    const multi = isMultiSelect(q);
    const keyless = !isKeyed(q);

    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      const next = multi
        ? current.includes(optionIndex)
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex]
        : [optionIndex];
      return { ...prev, [q.id]: next };
    });

    if (!multi && !keyless && settings.mode === "practice") {
      setRevealed((prev) => ({ ...prev, [q.id]: true }));
    }
  }

  function startAttempt(nextPool: Question[]) {
    setPool(nextPool);
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
    setTimedOut(false);
    setResult(null);
    setSeed(Math.floor(Math.random() * 1_000_000) + 1);
    setAttempt((a) => a + 1);
    window.scrollTo({ top: 0 });
  }

  function handleSettingsChange(next: Settings) {
    // Leaving practice mode hides answers that were already revealed.
    if (next.mode === "exam" && settings.mode !== "exam") setRevealed({});
    setSettings(next);
  }

  const answered = prepared.filter(({ q }) => (answers[q.id] ?? []).length > 0).length;
  const reviewing = pool.length < questions.length;

  return (
    <>
      <QuizToolbar
        title={title}
        answered={answered}
        total={prepared.length}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        remaining={remaining}
        submitted={submitted}
        scoreable={scoreable}
        onSubmit={() => submitQuiz(false)}
      />

      {note && (
        <p className="mb-5 rounded-lg border border-line bg-raised/50 px-4 py-3 text-[13px] leading-relaxed text-muted">
          <span className="mono mr-2 text-[11px] tracking-wider text-accent uppercase">
            Note
          </span>
          {note}
        </p>
      )}

      {submitted && result && (
        <ScoreSummary
          score={result.score}
          total={keyed.length}
          wrongCount={result.wrongIds.length}
          timedOut={timedOut}
          onRetryAll={() => startAttempt(questions)}
          onRetryWrong={() =>
            startAttempt(questions.filter((q) => result.wrongIds.includes(q.id)))
          }
        />
      )}

      {reviewing && !submitted && (
        <p className="mono mb-5 rounded-lg border border-bad/40 bg-bad-dim/30 px-4 py-2.5 text-xs text-bad">
          Reviewing {pool.length} question{pool.length === 1 ? "" : "s"} you got wrong.
        </p>
      )}

      <ul className="space-y-5">
        {prepared.map(({ q, optionOrder }, index) => (
          <QuestionCard
            key={q.id}
            index={index}
            question={q}
            optionOrder={optionOrder}
            selected={answers[q.id] ?? []}
            revealed={Boolean(revealed[q.id])}
            locked={submitted || Boolean(revealed[q.id])}
            multi={isMultiSelect(q)}
            onToggle={(optionIndex) => toggleOption(q, optionIndex)}
            onCheck={() => setRevealed((prev) => ({ ...prev, [q.id]: true }))}
          />
        ))}
      </ul>

      {!submitted && scoreable && (
        <button
          type="button"
          onClick={() => submitQuiz(false)}
          className="mono mt-6 w-full rounded-lg bg-accent py-3.5 text-sm font-medium transition-colors hover:bg-accent-dim"
        >
          Submit Quiz
        </button>
      )}
    </>
  );
}
