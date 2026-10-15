import { course } from "@/data/course";
import { allTopics, weeks } from "@/data";
import WeekGrid, { type WeekMeta } from "@/components/WeekGrid";

export default function Home() {
  const weekMeta: WeekMeta[] = weeks.map((w) => ({
    slug: w.slug,
    label: w.label,
    count: w.questions.length,
  }));

  const allMeta: WeekMeta = {
    slug: allTopics.slug,
    label: allTopics.label,
    count: allTopics.questions.length,
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <header className="mb-10">
        <div className="mono mb-1 text-xs tracking-widest text-accent uppercase">
          {course.subtitle}
        </div>
        <h1 className="mono text-2xl font-bold sm:text-3xl">{course.title}</h1>
        <p className="mono mt-1.5 text-xs text-muted">{course.meta}</p>
      </header>

      <WeekGrid weeks={weekMeta} all={allMeta} />

      <footer className="mono mt-12 border-t border-line-soft pt-5 text-[11px] text-muted">
        Progress is stored in this browser only. Nothing is uploaded.
      </footer>
    </main>
  );
}
