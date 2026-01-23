"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AnalysisResult = {
  ok?: boolean;
  summary?: string;
  jdAnalysis?: {
    requiredSkills: string[];
    preferredSkills: string[];
    level: string;
  };
  jdRequired?: string[];
  jdPreferred?: string[];
  resumeSkills?: string[];
  matchScore?: number;
  scoreBreakdown?: {
    requiredScore: number;
    preferredScore: number;
  };
  missingSkills?: {
    required: string[];
    preferred: string[];
  };
  aiSummary?: {
    strengths: string[];
    gaps: string[];
    overallFit: string;
  };
  semanticScore?: number;
  skillScore?: number;
};

const ScoreCard = ({ 
  score, 
  label, 
  subtitle 
}: { 
  score?: number; 
  label: string; 
  subtitle: string;
}) => {
  const getScoreColor = (value?: number) => {
    if (typeof value !== "number") return "text-stone-400";
    if (value >= 70) return "text-emerald-600";
    if (value >= 50) return "text-coral-600";
    return "text-rose-600";
  };

  const getScoreBg = (value?: number) => {
    if (typeof value !== "number") return "bg-stone-100";
    if (value >= 70) return "bg-emerald-50";
    if (value >= 50) return "bg-coral-50";
    return "bg-rose-50";
  };

  const getScoreBorder = (value?: number) => {
    if (typeof value !== "number") return "border-stone-200";
    if (value >= 70) return "border-emerald-200";
    if (value >= 50) return "border-coral-200";
    return "border-rose-200";
  };

  return (
    <div className={`rounded-2xl border-2 ${getScoreBorder(score)} ${getScoreBg(score)} p-6 transition-all hover:scale-105`}>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          {label}
        </p>
        <p className={`mt-3 text-5xl font-bold ${getScoreColor(score)}`}>
          {typeof score === "number" ? score : "--"}
        </p>
        <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
};

const SkillBadge = ({ 
  skill, 
  isMissing 
}: { 
  skill: string; 
  isMissing: boolean;
}) => {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
      isMissing 
        ? "bg-rose-100 text-rose-700 border border-rose-200" 
        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
    }`}>
      {skill}
    </span>
  );
};

const CircularProgress = ({ 
  score, 
  size = 140 
}: { 
  score?: number; 
  size?: number;
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = typeof score === "number" ? Math.max(0, Math.min(100, score)) : 0;
  const offset = circumference - (value / 100) * circumference;

  const getStrokeColor = (val?: number) => {
    if (typeof val !== "number") return "#d6d3d1";
    if (val >= 70) return "#10b981";
    if (val >= 50) return "#ff6b6b";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e7e5e4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-stone-900">
          {typeof score === "number" ? score : "--"}
        </p>
        <p className="text-xs text-stone-500">score</p>
      </div>
    </div>
  );
};

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("jobfit_result");
    if (raw) {
      setResult(JSON.parse(raw));
    }
  }, []);

  const required = result?.jdRequired ?? result?.jdAnalysis?.requiredSkills ?? [];
  const preferred = result?.jdPreferred ?? result?.jdAnalysis?.preferredSkills ?? [];
  const missingRequired = result?.missingSkills?.required ?? [];
  const missingPreferred = result?.missingSkills?.preferred ?? [];

  if (!result) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-12">
          <svg className="mx-auto h-16 w-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-6 text-2xl font-semibold text-stone-900">No analysis found</h2>
          <p className="mt-3 text-stone-600">Please analyze a resume first.</p>
          <Link
            href="/analyze"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-coral-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg"
          >
            Go to Analyze
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      {/* Header */}
      <header className="mb-8 rounded-2xl border border-stone-200 bg-white px-8 py-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Analysis Complete
          </p>
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold text-stone-900">
            Match Report
          </h1>
          <span className="text-base font-medium text-stone-500">
            Resume vs Job Description
          </span>
        </div>
      </header>

      {/* Two Column Layout: Sticky Sidebar + Scrollable Content */}
      <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Sticky Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            {/* Overall Match - Main Score */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Overall Match
              </p>
              <div className="mt-4 flex justify-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg width={140} height={140} className="rotate-[-90deg]">
                    <circle
                      cx={70}
                      cy={70}
                      r={60}
                      stroke="#e2e8f0"
                      strokeWidth={12}
                      fill="none"
                    />
                    <circle
                      cx={70}
                      cy={70}
                      r={60}
                      stroke={
                        typeof result.matchScore === "number"
                          ? result.matchScore >= 70
                            ? "#10b981"
                            : result.matchScore >= 50
                            ? "#ff6b6b"
                            : "#ef4444"
                          : "#cbd5e1"
                      }
                      strokeWidth={12}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={
                        2 * Math.PI * 60 -
                        ((typeof result.matchScore === "number"
                          ? result.matchScore
                          : 0) /
                          100) *
                          2 *
                          Math.PI *
                          60
                      }
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p
                      className={`text-5xl font-bold ${
                        typeof result.matchScore === "number"
                          ? result.matchScore >= 70
                            ? "text-emerald-600"
                            : result.matchScore >= 50
                            ? "text-coral-600"
                            : "text-rose-600"
                          : "text-stone-400"
                      }`}
                    >
                      {typeof result.matchScore === "number"
                        ? result.matchScore
                        : "--"}
                      {typeof result.matchScore === "number" && (
                        <span className="text-3xl">%</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-600">
                Combined skill + semantic score
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-stone-200"></div>

            {/* Sub-scores */}
            <div className="space-y-4">
              {/* Skill Match */}
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                  <span className="uppercase tracking-wider text-stone-500">
                    Skill Match
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      typeof result.skillScore === "number"
                        ? result.skillScore >= 70
                          ? "text-emerald-600"
                          : result.skillScore >= 50
                          ? "text-coral-600"
                          : "text-rose-600"
                        : "text-stone-400"
                    }`}
                  >
                    {typeof result.skillScore === "number"
                      ? result.skillScore
                      : "--"}
                    {typeof result.skillScore === "number" && (
                      <span className="text-sm">%</span>
                    )}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      typeof result.skillScore === "number"
                        ? result.skillScore >= 70
                          ? "bg-emerald-500"
                          : result.skillScore >= 50
                          ? "bg-coral-500"
                          : "bg-rose-500"
                        : "bg-stone-300"
                    }`}
                    style={{
                      width: `${
                        typeof result.skillScore === "number"
                          ? result.skillScore
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  Required + preferred
                </p>
              </div>

              {/* Semantic Match */}
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                  <span className="uppercase tracking-wider text-stone-500">
                    Semantic Match
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      typeof result.semanticScore === "number"
                        ? result.semanticScore >= 70
                          ? "text-emerald-600"
                          : result.semanticScore >= 50
                          ? "text-coral-600"
                          : "text-rose-600"
                        : "text-stone-400"
                    }`}
                  >
                    {typeof result.semanticScore === "number"
                      ? result.semanticScore
                      : "--"}
                    {typeof result.semanticScore === "number" && (
                      <span className="text-sm">%</span>
                    )}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      typeof result.semanticScore === "number"
                        ? result.semanticScore >= 70
                          ? "bg-emerald-500"
                          : result.semanticScore >= 50
                          ? "bg-coral-500"
                          : "bg-rose-500"
                        : "bg-stone-300"
                    }`}
                    style={{
                      width: `${
                        typeof result.semanticScore === "number"
                          ? result.semanticScore
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  Story & intent alignment
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Scrollable Content */}
        <section className="space-y-10">
        {/* AI Summary */}
        {result.aiSummary && (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-stone-200">
                <svg className="h-6 w-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-950">AI Analysis</h2>
                <p className="mt-0.5 text-base font-medium text-stone-600">Personalized insights for your application</p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-base font-bold text-emerald-900">Your Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {result.aiSummary.strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-3 text-base leading-relaxed text-stone-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="font-medium">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-coral-200 bg-coral-50/50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-coral-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-base font-bold text-coral-900">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {result.aiSummary.gaps.map((gap, idx) => (
                    <li key={idx} className="flex gap-3 text-base leading-relaxed text-stone-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" />
                      <span className="font-medium">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-stone-900">Overall Assessment</h3>
              <p className="text-base leading-relaxed text-stone-700">{result.aiSummary.overallFit}</p>
            </div>
          </div>
        )}

          {/* Skill Analysis */}
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-stone-200">
                <svg className="h-6 w-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-950">Skill Analysis</h2>
                <p className="mt-0.5 text-base font-medium text-stone-600">Required and preferred skills breakdown</p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Required Skills */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-stone-900">Required Skills</h3>
                  <p className="mt-1 text-sm font-medium text-stone-500">Must-have qualifications</p>
                </div>

                <div className="my-8 flex justify-center">
                  <CircularProgress score={result.scoreBreakdown?.requiredScore} size={120} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {required.length > 0 ? (
                    required.map((skill) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        isMissing={missingRequired.includes(skill)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-stone-500">No required skills extracted</p>
                  )}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-stone-900">Preferred Skills</h3>
                  <p className="mt-1 text-sm font-medium text-stone-500">Nice-to-have qualifications</p>
                </div>

                <div className="my-8 flex justify-center">
                  <CircularProgress score={result.scoreBreakdown?.preferredScore} size={120} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {preferred.length > 0 ? (
                    preferred.map((skill) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        isMissing={missingPreferred.includes(skill)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-stone-500">No preferred skills extracted</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Semantic Match Details */}
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-stone-200">
              <svg className="h-6 w-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-950">Semantic Analysis</h2>
              <p className="mt-0.5 text-base font-medium text-stone-600">How well your experience narrative matches the role</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[auto_1fr]">
            <div className="flex justify-center md:justify-start">
              <CircularProgress score={result.semanticScore} size={140} />
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                <h3 className="mb-2 text-base font-semibold text-stone-900">What is Semantic Matching?</h3>
                <p className="text-base text-stone-700 leading-relaxed">
                  Beyond keyword matching, semantic analysis compares the meaning and context of your resume 
                  with the job description. It evaluates how well your experience story aligns with what the role needs.
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                <h3 className="mb-2 text-base font-semibold text-stone-900">Your Score Interpretation</h3>
                <p className="text-base text-stone-700 leading-relaxed">
                  {typeof result.semanticScore === "number" ? (
                    result.semanticScore >= 70 ? (
                      "Excellent alignment! Your experience narrative strongly matches the role's expectations."
                    ) : result.semanticScore >= 50 ? (
                      "Good foundation. Consider emphasizing relevant experiences that align with key role responsibilities."
                    ) : (
                      "Room for improvement. Focus on highlighting experiences that directly relate to the job's core functions."
                    )
                  ) : (
                    "Score not available"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div>
          <Link href="/analyze" className="text-base underline text-stone-600 hover:text-stone-900 transition">
            Back to Analyze
          </Link>
        </div>
      </section>
    </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-coral-500 to-rose-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:scale-105"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Analyze Another Job
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-stone-300 bg-white px-6 py-3 font-semibold text-stone-900 transition hover:bg-stone-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>
    </main>
  );
}
