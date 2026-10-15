"use client";

import type { Question } from "@/lib/types";
import { answerIndices, cn, isCorrect, OPTION_LETTERS } from "@/lib/utils";

type Props = {
  index: number;
  question: Question;
  /** Display order: optionOrder[displayIndex] = index into question.options. */
  optionOrder: number[];
  selected: number[];
  revealed: boolean;
  locked: boolean;
  multi: boolean;
  onToggle: (optionIndex: number) => void;
  onCheck: () => void;
};

function optionClasses(args: {
  revealed: boolean;
  isSelected: boolean;
  isAnswer: boolean;
}) {
  const { revealed, isSelected, isAnswer } = args;

  if (!revealed) {
    return isSelected
      ? "border-accent bg-accent/15 text-white"
      : "border-line bg-surface hover:border-accent/60 hover:bg-raised";
  }
  if (isAnswer) return "border-good bg-good-dim/60 text-white";
  if (isSelected) return "border-bad bg-bad-dim/60 text-white";
  return "border-line-soft bg-surface/40 text-muted";
}

export default function QuestionCard({
  index,
  question,
  optionOrder,
  selected,
  revealed,
  locked,
  multi,
  onToggle,
  onCheck,
}: Props) {
  const correct = answerIndices(question.answer);
  const gotItRight = isCorrect(question, selected);

  return (
    <li
      id={`q-${question.id}`}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-xl border bg-surface/60",
        revealed && gotItRight && "border-good/40",
        revealed && !gotItRight && "border-bad/40",
        !revealed && "border-line",
      )}
    >
      <div className="flex items-start gap-3 border-b border-line-soft bg-raised/60 px-4 py-3.5">
        <span className="mono shrink-0 pt-0.5 text-sm font-bold text-accent">
          {index + 1}.
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-relaxed">{question.question}</p>
          {multi && (
            <p className="mono mt-1.5 text-[11px] text-muted">
              Select {correct.length} options
            </p>
          )}
        </div>
        {revealed && (
          <span
            className={cn(
              "mono shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium",
              gotItRight ? "bg-good-dim text-good" : "bg-bad-dim text-bad",
            )}
          >
            {gotItRight ? "correct" : "wrong"}
          </span>
        )}
      </div>

      <div
        role={multi ? "group" : "radiogroup"}
        aria-label={`Options for question ${index + 1}`}
        className="grid gap-2.5 p-4 sm:grid-cols-2"
      >
        {optionOrder.map((optionIndex, displayIndex) => {
          const isSelected = selected.includes(optionIndex);
          const isAnswer = correct.includes(optionIndex);

          return (
            <button
              key={optionIndex}
              type="button"
              disabled={locked}
              aria-pressed={isSelected}
              onClick={() => onToggle(optionIndex)}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-3 text-left text-sm leading-relaxed transition-colors",
                locked ? "cursor-default" : "cursor-pointer",
                optionClasses({ revealed, isSelected, isAnswer }),
              )}
            >
              <span className="mono shrink-0 pt-px text-xs font-bold opacity-60">
                {OPTION_LETTERS[displayIndex] ?? displayIndex + 1}
              </span>
              <span className="min-w-0 flex-1">{question.options[optionIndex]}</span>
              {revealed && isAnswer && (
                <span aria-hidden className="mono shrink-0 text-good">
                  ✓
                </span>
              )}
              {revealed && isSelected && !isAnswer && (
                <span aria-hidden className="mono shrink-0 text-bad">
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!revealed && multi && selected.length > 0 && !locked && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onCheck}
            className="mono rounded-lg border border-accent/60 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/15"
          >
            Check answer
          </button>
        </div>
      )}

      {revealed && question.explanation && (
        <div className="border-t border-line-soft bg-raised/40 px-4 py-3">
          <span className="mono mr-2 text-[11px] tracking-wider text-accent uppercase">
            Why
          </span>
          <span className="text-[13px] leading-relaxed text-muted">
            {question.explanation}
          </span>
        </div>
      )}
    </li>
  );
}
