# Conservation Geography — Quiz Practice

Week-wise practice quizzes for the NPTEL **Conservation Geography** course (noc26_ge82) —
130 questions across Week 0 to Week 12, taken from the course assignments.

- Week 0–12 sets plus an **All Topics** combined set (all 130 questions)
- **Practice** mode (answer revealed instantly) or **Exam** mode (revealed on submit)
- Optional **shuffle** of questions and options, and an optional **countdown timer** that auto-submits
- Score summary with **Retry all** / **Review only the ones you got wrong**
- Best score per week kept in the browser's localStorage — nothing is uploaded

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

## Two caveats on the answers

- **Week 0** is the ungraded practice assignment. NPTEL publishes no official key for it, so
  its answers are worked out from the course content — treat them as unverified.
- **Week 12** had no published key either (that assignment was still open for submission), so its
  answers are **tentative** — worked out from course material and explained question by question
  in `data/weeks/week12.ts`. Question 8 is the least certain. Replace them with the official key
  when NPTEL publishes it.

## Add or edit questions

Edit `data/weeks/weekN.ts`:

```ts
export const week3: Question[] = [
  {
    id: "w3-q1",                 // unique across all weeks
    question: "…",
    options: ["…", "…", "…", "…"],
    answer: 2,                   // index into options; [0, 2] for multi-select; omit if no key
    explanation: "…",            // optional
  },
];
```

Nothing else to register — the week list, the All Topics set and the routes are derived
from `data/index.ts`.

Built with Next.js 16, React 19, Tailwind CSS 4 and TypeScript.
