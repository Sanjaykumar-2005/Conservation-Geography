import type { Question } from "./types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Correct option indices, normalised to an array. Empty when there is no key. */
export function answerIndices(answer: Question["answer"]): number[] {
  if (answer === undefined) return [];
  return Array.isArray(answer) ? answer : [answer];
}

/** False for questions whose answer key has not been released. */
export function isKeyed(q: Question) {
  return q.answer !== undefined;
}

/** True when more than one option must be selected. */
export function isMultiSelect(q: Question) {
  return answerIndices(q.answer).length > 1;
}

export function isCorrect(q: Question, selected: number[]) {
  if (!isKeyed(q)) return false;
  const correct = answerIndices(q.answer);
  if (selected.length !== correct.length) return false;
  return correct.every((i) => selected.includes(i));
}

/** Small seeded PRNG so a shuffle stays stable for the whole attempt. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
