import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-5 py-20">
      <h1 className="mono text-2xl font-bold">404</h1>
      <p className="mono mt-2 text-sm text-muted">That page does not exist.</p>
      <Link
        href="/"
        className="mono mt-6 rounded-lg border border-line px-3.5 py-2 text-xs text-accent transition-colors hover:border-accent"
      >
        ← Back to weeks
      </Link>
    </main>
  );
}
