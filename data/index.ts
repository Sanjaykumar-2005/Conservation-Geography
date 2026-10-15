import type { Question, Week } from "@/lib/types";
import { isKeyed } from "@/lib/utils";
import { week0 } from "./weeks/week0";
import { week1 } from "./weeks/week1";
import { week2 } from "./weeks/week2";
import { week3 } from "./weeks/week3";
import { week4 } from "./weeks/week4";
import { week5 } from "./weeks/week5";
import { week6 } from "./weeks/week6";
import { week7 } from "./weeks/week7";
import { week8 } from "./weeks/week8";
import { week9 } from "./weeks/week9";
import { week10 } from "./weeks/week10";
import { week11 } from "./weeks/week11";
import { week12 } from "./weeks/week12";

/** Caveats carried over from the source PDF, or from how the answers were derived. */
const notes: Record<number, string> = {
  0: "Ungraded practice assignment. The portal publishes no official key for Week 0 — these answers are worked out from the course content, not verified against NPTEL.",
};

const sets: Question[][] = [
  week0,
  week1,
  week2,
  week3,
  week4,
  week5,
  week6,
  week7,
  week8,
  week9,
  week10,
  week11,
  week12,
];

export const weeks: Week[] = sets.map((questions, number) => ({
  slug: `week${number}`,
  label: `Week ${number}`,
  title: `Week ${number}`,
  note: notes[number],
  questions,
}));

/** Only answerable questions are combined — anything without a key can't be scored. */
export const allQuestions: Question[] = weeks.flatMap((w) =>
  w.questions.filter(isKeyed),
);

export const allTopics: Week = {
  slug: "all",
  label: "All Topics",
  title: "All Topics",
  note: "Every question from Week 0 to Week 12. The Week 0 answers are unofficial — see that week for the caveat.",
  questions: allQuestions,
};

export function getWeek(slug: string): Week | undefined {
  if (slug === allTopics.slug) return allTopics;
  return weeks.find((w) => w.slug === slug);
}

export function quizSlugs(): string[] {
  return [...weeks.map((w) => w.slug), allTopics.slug];
}
