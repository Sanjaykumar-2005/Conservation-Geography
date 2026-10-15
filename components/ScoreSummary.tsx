"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ScoreSummary({
  score,
  total,
  wrongCount,
  timedOut,
  onRetryAll,
  onRetryWrong,
}: {
  score: number;
  total: number;
  wrongCount: number;
  timedOut: boolean;
  onRetryAll: () => void;
  onRetryWrong: () => void;
}) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  const tone =
    pct >= 80 ? "text-good" : pct >= 50 ? "text-accent" : "text-bad";
  const barTone = pct >= 80 ? "bg-good" : pct >= 50 ? "bg-accent" : "bg-bad";

  return (
    <section
      id="score-summary"
      className="mb-6 scroll-mt-28 rounded-xl border border-line bg-surface p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mono text-[11px] tracking-widest text-muted uppercase">
            {timedOut ? "Time up — auto-submitted" : "Your score"}
          </div>
          <div className={cn("mono mt-1 text-3xl font-bold", tone)}>
            {score}
            <span className="text-xl text-muted">/{total}</span>
          </div>
        </div>
        <div className={cn("mono text-2xl font-bold", tone)}>{pct}%</div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-raised">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", barTone)}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onRetryAll}
          className="mono rounded-lg bg-accent px-3.5 py-2 text-xs font-medium transition-colors hover:bg-accent-dim"
        >
          Retry all
        </button>
        {wrongCount > 0 && (
          <button
            type="button"
            onClick={onRetryWrong}
            className="mono rounded-lg border border-bad/50 px-3.5 py-2 text-xs text-bad transition-colors hover:bg-bad-dim/50"
          >
            Review {wrongCount} wrong
          </button>
        )}
        <Link
          href="/"
          className="mono rounded-lg border border-line px-3.5 py-2 text-xs text-muted transition-colors hover:border-accent/60 hover:text-white"
        >
          Back to weeks
        </Link>
      </div>
    </section>
  );
}
