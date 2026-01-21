"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 font-sans">
      {/* Hero */}
      <section
        className="rounded-3xl border p-10 shadow-sm md:p-12"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--muted)" }}>
          JobFit
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl" style={{ color: "var(--foreground)" }}>
          Analyze your job match
        </h1>

        <p className="mt-6 max-w-2xl text-base" style={{ color: "var(--muted)" }}>
          Upload your resume and paste a job description to understand how well you fit.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/analyze"
            className="rounded-2xl px-6 py-3 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "var(--accent)", color: "var(--button-text)" }}
          >
            Start analysis →
          </Link>

          <Link
            href="/result"
            className="rounded-2xl border px-6 py-3 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            View sample result
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Skill match
          </span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Semantic similarity
          </span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            AI summary
          </span>
          <span className="rounded-full border px-3 py-1" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Missing skills
          </span>
        </div>
      </section>

      {/* Value props */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Blended scoring</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Combines keyword matching and semantic analysis for comprehensive evaluation.
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Skill gaps</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Clear breakdown of required and preferred skills you're missing.
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>Actionable insight</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            AI-generated summary of strengths, gaps, and fit assessment.
          </p>
        </div>
      </section>
    </main>
  );
}
