"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-gradient-to-br from-white via-white to-coral-50/20 p-12 shadow-2xl backdrop-blur md:p-16">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -top-24 right-8 h-72 w-72 rounded-full bg-gradient-to-br from-coral-200/30 to-peach-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-6 h-72 w-72 rounded-full bg-gradient-to-br from-peach-200/20 to-coral-200/20 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-stone-900 md:text-5xl">
              Check how your resume matches a job description
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-stone-600">
              Upload your resume and paste a job description to see detailed skill coverage and match analysis.
            </p>
            <p className="mt-3 text-sm text-stone-500">
              Optimized for technical roles and entry-level positions (internships, new grad, early career).
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-coral-500 to-rose-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Start Analysis
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-300 bg-white px-8 py-4 text-base font-semibold text-stone-900 transition-all hover:border-stone-400 hover:bg-stone-50"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Demo Card */}
          <div className="rounded-3xl border border-stone-200/60 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Sample Analysis
              </p>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Strong Match
              </span>
            </div>

            {/* Overall Score */}
            <div className="mb-6 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Overall Match Score
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-5xl font-bold text-emerald-600">82</p>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-700">+6</span>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mb-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Score Breakdown
              </p>
              
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                  <span className="text-stone-600">Skill Coverage</span>
                  <span className="font-mono text-stone-900">76%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-2.5 w-[76%] rounded-full bg-gradient-to-r from-stone-700 to-stone-500 transition-all duration-1000" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                  <span className="text-stone-600">Semantic Fit</span>
                  <span className="font-mono text-stone-900">88%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-2.5 w-[88%] rounded-full bg-gradient-to-r from-coral-500 to-peach-400 transition-all duration-1000" />
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-coral-50/30 to-peach-50/20 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                Key Insights
              </p>
              <p className="mb-3 text-sm leading-relaxed text-stone-700">
                Strong technical background. Focus on quantifying impact and adding 4 missing skills.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
                  Storytelling
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
                  React
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
                  Metrics
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Three simple steps
          </p>
        </div>

        <div className="mt-12 flex items-start justify-center gap-4 md:gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-coral-500 to-rose-500 text-sm font-bold text-white">
              1
            </div>
            <h3 className="mt-4 text-base font-semibold text-stone-900">
              Upload Resume
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              PDF format
            </p>
          </div>

          {/* Arrow */}
          <svg className="hidden h-6 w-6 text-stone-300 md:block mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-coral-500 to-rose-500 text-sm font-bold text-white">
              2
            </div>
            <h3 className="mt-4 text-base font-semibold text-stone-900">
              Add Job Description
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Paste full text
            </p>
          </div>

          {/* Arrow */}
          <svg className="hidden h-6 w-6 text-stone-300 md:block mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-coral-500 to-rose-500 text-sm font-bold text-white">
              3
            </div>
            <h3 className="mt-4 text-base font-semibold text-stone-900">
              Get Insights
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Instant results
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">
            Key Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            What you'll get from the analysis
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-100">
              <svg className="h-6 w-6 text-coral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="mt-4 font-semibold text-stone-900">Skill Coverage</h4>
            <p className="mt-2 text-sm text-stone-600">
              Required and preferred skills breakdown
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-peach-100">
              <svg className="h-6 w-6 text-peach-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="mt-4 font-semibold text-stone-900">Analysis Summary</h4>
            <p className="mt-2 text-sm text-stone-600">
              Strengths and areas to improve
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
              <svg className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="mt-4 font-semibold text-stone-900">Match Score</h4>
            <p className="mt-2 text-sm text-stone-600">
              Overall compatibility percentage
            </p>
          </div>
        </div>
      </section>

      {/* Technical Deep Dive */}
      <section className="mt-24">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between list-none">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-coral-500 to-rose-500">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Technical Deep Dive</h2>
                  <p className="text-sm text-stone-600">See how it works under the hood</p>
                </div>
              </div>
              <svg className="h-6 w-6 text-stone-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <div className="mt-8 space-y-6">
              {/* Scope */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-4">
                <p className="text-sm leading-relaxed text-stone-700">
                  JobFit is tuned for <strong>technical job descriptions</strong> and <strong>entry-level applicants</strong> (interns, new grads, early career). Results are most meaningful for these cases; it is not designed for senior or highly experienced roles.
                </p>
              </div>

              {/* Overview */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">Beyond Keyword Matching</h3>
                <p className="text-base leading-relaxed text-stone-700">
                  Traditional ATS tools rely on exact keyword matches, missing semantic relevance when wording differs. 
                  JobFit combines semantic analysis with skill extraction to provide a comprehensive, interpretable match score.
                </p>
                <div className="mt-4 rounded-lg border border-coral-200 bg-coral-50/50 p-4">
                  <p className="text-sm font-medium text-coral-900 mb-2">Example:</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-stone-700">Job Description:</span>
                      <span className="text-stone-600"> "React experience required"</span>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700">Your Resume:</span>
                      <span className="text-stone-600"> "Built SPAs with modern frontend frameworks"</span>
                    </div>
                    <p className="mt-2 text-coral-700">
                      ✓ Semantic matching captures this alignment even without exact keywords
                    </p>
                  </div>
                </div>
              </div>

              {/* Semantic Similarity */}
              <details className="group/item rounded-xl border border-stone-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 list-none hover:bg-stone-50/50 transition">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-100">
                      <svg className="h-4 w-4 text-coral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-stone-900">Semantic Similarity Engine</h3>
                  </div>
                  <svg className="h-5 w-5 text-stone-400 transition-transform group-open/item:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-stone-200 p-5 space-y-4">
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-2">How it works:</h4>
                    <ul className="space-y-2 text-sm text-stone-700">
                      <li className="flex gap-2">
                        <span className="text-coral-500">1.</span>
                        <span>Generate embeddings for both job description and resume using OpenAI text-embedding-3-small</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coral-500">2.</span>
                        <span>Compute cosine similarity between the embedding vectors</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coral-500">3.</span>
                        <span>Normalize similarity score to 0-100 range for interpretability</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-stone-100 p-4">
                    <p className="text-sm font-semibold text-stone-900 mb-2">Why embeddings?</p>
                    <p className="text-sm text-stone-700">
                      Embeddings capture conceptual alignment by representing text as high-dimensional vectors. 
                      Similar concepts cluster together in vector space, enabling semantic matching beyond exact word overlap.
                    </p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-4">
                    <p className="text-sm font-semibold text-stone-900 mb-2">Limitation:</p>
                    <p className="text-sm text-stone-700">
                      While powerful for conceptual matching, embeddings alone don't indicate which specific skills are missing. 
                      That's why we combine this with explicit skill extraction.
                    </p>
                  </div>
                </div>
              </details>

              {/* Skill Extraction */}
              <details className="group/item rounded-xl border border-stone-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 list-none hover:bg-stone-50/50 transition">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-peach-100">
                      <svg className="h-4 w-4 text-peach-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-stone-900">Skill Extraction & Matching</h3>
                  </div>
                  <svg className="h-5 w-5 text-stone-400 transition-transform group-open/item:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-stone-200 p-5 space-y-4">
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-2">LLM-based extraction:</h4>
                    <p className="text-sm text-stone-700 mb-3">
                      Uses GPT to extract required and preferred skills from job descriptions, understanding context that regex patterns miss.
                    </p>
                    <ul className="space-y-2 text-sm text-stone-700">
                      <li className="flex gap-2">
                        <span className="text-peach-500">•</span>
                        <span><strong>Required skills:</strong> Must-have qualifications</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-peach-500">•</span>
                        <span><strong>Preferred skills:</strong> Nice-to-have additions</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-stone-100 p-4">
                    <p className="text-sm font-semibold text-stone-900 mb-2">Why LLM instead of regex?</p>
                    <ul className="space-y-1 text-sm text-stone-700">
                      <li>• Job description phrasing varies wildly across companies</li>
                      <li>• Skills appear in responsibilities, qualifications, or culture sections</li>
                      <li>• LLMs understand context (e.g., "frontend-focused role" → React/TypeScript implied)</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-4">
                    <p className="text-sm font-semibold text-stone-900 mb-2">Importance weighting:</p>
                    <p className="text-sm text-stone-700 mb-2">
                      Not all skills are equally important. The system assigns weights based on:
                    </p>
                    <ul className="space-y-1 text-sm text-stone-700">
                      <li>• Linguistic cues ("must", "required" vs "preferred", "nice-to-have")</li>
                      <li>• Position in job description (earlier = more important)</li>
                      <li>• Frequency and emphasis</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Scoring System */}
              <details className="group/item rounded-xl border border-stone-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 list-none hover:bg-stone-50/50 transition">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-200">
                      <svg className="h-4 w-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-stone-900">Multi-Signal Scoring System</h3>
                  </div>
                  <svg className="h-5 w-5 text-stone-400 transition-transform group-open/item:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-stone-200 p-5 space-y-4">
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-3">Multiple interpretable scores:</h4>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-coral-200 bg-coral-50/30 p-4">
                        <p className="text-sm font-semibold text-coral-900 mb-1">Semantic Score (0-100)</p>
                        <p className="text-sm text-stone-700">
                          Measures conceptual alignment between your experience narrative and role expectations
                        </p>
                      </div>
                      <div className="rounded-lg border border-peach-200 bg-peach-50/30 p-4">
                        <p className="text-sm font-semibold text-peach-700 mb-1">Skill Match Score (weighted)</p>
                        <p className="text-sm text-stone-700">
                          Combines required skill coverage (90% weight) and preferred skill coverage (10% weight)
                        </p>
                      </div>
                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                        <p className="text-sm font-semibold text-stone-900 mb-1">Final Match Score (blended)</p>
                        <p className="text-sm text-stone-700">
                          Weighted combination of semantic similarity and skill matching for holistic evaluation
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-stone-100 p-4">
                    <p className="text-sm font-semibold text-stone-900 mb-2">Why multiple scores?</p>
                    <p className="text-sm text-stone-700">
                      A single opaque number doesn't explain why you're a good or poor match. 
                      Breaking down the score into interpretable components helps you understand exactly where you stand 
                      and what to improve.
                    </p>
                  </div>
                </div>
              </details>

              {/* Tech Stack */}
              <div className="mt-6 rounded-xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">Built With</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">
                    Next.js
                  </span>
                  <span className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">
                    TypeScript
                  </span>
                  <span className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">
                    OpenAI API
                  </span>
                  <span className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">
                    OpenAI Embeddings
                  </span>
                  <span className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">
                    Tailwind CSS
                  </span>
                </div>
              </div>
            </div>
          </details>
        </div>
      </section>

    </main>
  );
}