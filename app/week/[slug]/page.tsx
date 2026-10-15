import Link from "next/link";
import { notFound } from "next/navigation";
import QuizClient from "@/components/QuizClient";
import { course } from "@/data/course";
import { getWeek, quizSlugs } from "@/data";

/**
 * The quiz is one `params`-dependent shell, so there is nothing useful to stream
 * before the slug resolves. Block instead of serving an empty instant shell.
 */
export const instant = false;

export function generateStaticParams() {
  return quizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/week/[slug]">) {
  const { slug } = await params;
  const week = getWeek(slug);
  return {
    title: week ? `${week.title} — ${course.title}` : course.title,
  };
}

export default async function WeekPage({ params }: PageProps<"/week/[slug]">) {
  const { slug } = await params;
  const week = getWeek(slug);
  if (!week) notFound();

  if (week.questions.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-10">
        <h1 className="mono text-xl font-bold">{week.title}</h1>
        <p className="mono mt-3 text-sm text-muted">
          No questions have been added for this week yet.
        </p>
        <Link
          href="/"
          className="mono mt-6 inline-block rounded-lg border border-line px-3.5 py-2 text-xs text-accent transition-colors hover:border-accent"
        >
          ← Back to weeks
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16">
      <QuizClient
        slug={week.slug}
        title={`${course.title}: ${week.title}`}
        note={week.note}
        questions={week.questions}
      />
    </main>
  );
}
