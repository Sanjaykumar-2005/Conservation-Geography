"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  clearProgress,
  getProgress,
  getProgressServerSnapshot,
  subscribe,
} from "@/lib/progress";
import { cn } from "@/lib/utils";

export type WeekMeta = {
  slug: string;
  label: string;
  count: number;
};

function scoreTone(pct: number) {
  if (pct >= 80) return "border-good/50 bg-good-dim/50 text-good";
  if (pct >= 50) return "border-accent/50 bg-accent-dim/30 text-accent";
  return "border-bad/50 bg-bad-dim/50 text-bad";
}

function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <span
      className={cn(
        "mono shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-medium",
        scoreTone(pct),
      )}
      title={`Best score: ${score}/${total}`}
    >
      {score}/{total}
    </span>
  );
}

export default function WeekGrid({
  weeks,
  all,
}: {
  weeks: WeekMeta[];
  all: WeekMeta;
}) {
  // Reads localStorage on the client only, so server HTML and hydration agree.
  const progress = useSyncExternalStore(
    subscribe,
    getProgress,
    getProgressServerSnapshot,
  );

  const attempted = weeks.filter((w) => progress[w.slug]).length;
  const available = weeks.filter((w) => w.count > 0).length;
  const pct = available ? Math.round((attempted / available) * 100) : 0;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="mono text-lg font-bold">Select a week to practice</h2>
        {attempted > 0 && (
          <button
            type="button"
            onClick={clearProgress}
            className="mono text-xs text-muted underline-offset-4 transition-colors hover:text-bad hover:underline"
          >
            Reset progress
          </button>
        )}
      </div>

      {available > 0 && (
        <div className="mb-6">
          <div className="mono mb-2 flex justify-between text-xs text-muted">
            <span>
              {attempted} of {available} weeks attempted
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week) => {
          const result = progress[week.slug];
          const empty = week.count === 0;

          if (empty) {
            return (
              <li
                key={week.slug}
                className="flex cursor-not-allowed items-center justify-between gap-3 rounded-lg border border-dashed border-line-soft px-4 py-3.5 opacity-50"
              >
                <span className="mono text-sm">{week.label}</span>
                <span className="mono text-[11px] text-muted">no questions yet</span>
              </li>
            );
          }

          return (
            <li key={week.slug}>
              <Link
                href={`/week/${week.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3.5 transition-colors hover:border-accent hover:bg-raised"
              >
                <span className="min-w-0">
                  <span className="mono block text-sm font-medium">{week.label}</span>
                  <span className="mono block text-[11px] text-muted">
                    {week.count} question{week.count === 1 ? "" : "s"}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {result && <ScoreBadge score={result.score} total={result.total} />}
                  <span
                    aria-hidden
                    className="mono text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {all.count > 0 && (
        <Link
          href={`/week/${all.slug}`}
          className="group mt-4 flex items-center justify-between gap-3 rounded-lg bg-accent px-4 py-3.5 font-medium transition-colors hover:bg-accent-dim"
        >
          <span className="mono text-sm">
            {all.label}
            <span className="ml-2 font-normal text-white/70">
              {all.count} question{all.count === 1 ? "" : "s"}
            </span>
          </span>
          <span className="flex items-center gap-2">
            {progress[all.slug] && (
              <span className="mono rounded border border-white/30 bg-white/10 px-1.5 py-0.5 text-[11px]">
                {progress[all.slug].score}/{progress[all.slug].total}
              </span>
            )}
            <span
              aria-hidden
              className="mono transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </Link>
      )}
    </section>
  );
}
