export type Question = {
  /** Stable id, e.g. "w1-q3". Used as the localStorage key for wrong-answer review. */
  id: string;
  question: string;
  options: string[];
  /**
   * Index into `options`; an array for multi-select (MSQ). Omitted when no
   * answer key has been released — such questions are shown but never scored.
   */
  answer?: number | number[];
  explanation?: string;
};

export type Week = {
  /** URL segment, e.g. "week1" or "all". */
  slug: string;
  /** Short label for the grid card, e.g. "Week 1". */
  label: string;
  /** Full heading shown on the quiz page. */
  title: string;
  /** Caveat banner shown above the questions (provenance of the answer key). */
  note?: string;
  questions: Question[];
};

export type QuizMode = "practice" | "exam";
