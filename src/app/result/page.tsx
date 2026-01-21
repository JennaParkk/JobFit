"use client";

import SkillTag from "@/components/SkillTag";
import { useEffect, useState } from "react";

type JDAnalysis = {
  requiredSkills: string[];
  preferredSkills: string[];
  level: string;
}; 

type AnalysisResult = {
  ok? : boolean;
  summary?: string;

  // from API
  jdAnalysis?: {
    requiredSkills: string[];
    preferredSkills: string[];
    level: string;
  };
  jdRequired?: string[];
  jdPreferred?: string[];

  // resumeSkills, matchScore, missingSkills to be added later
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
  semanticScore?: number; // embedding similarity based score 0-100
  skillScore?: number; // required/preferred skill match score 0-100

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
  const requiredScore = result?.scoreBreakdown?.requiredScore;
  const preferredScore = result?.scoreBreakdown?.preferredScore;

  // const searchParams = useSearchParams();
  // const jdFromURL = searchParams.get("jd") ?? "";
  return (
    <main className="font-sans lg:flex lg:h-[calc(100vh-8rem)] lg:flex-col lg:overflow-hidden">
      <div
        className="rounded-2xl border p-6 shadow-sm"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            Result
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
            Your job match
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Comprehensive analysis of your fit for this role.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:flex-1 lg:min-h-0 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit space-y-4">
          <div
            className="rounded-2xl border p-4 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
              Overall
            </p>
            <p className="mt-2 text-3xl font-semibold" style={{ color: "var(--accent)" }}>
              {typeof result?.matchScore === "number"
                ? `${result.matchScore}%`
                : "--"}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              Overall fit score
            </p>
          </div>

          <div
            className="rounded-2xl border p-4 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
              Skill Match
            </p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
              {typeof result?.skillScore === "number" ? `${result.skillScore}%` : "--"}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              Overall skill alignment
            </p>
          </div>

          <div
            className="rounded-2xl border p-4 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
              Semantic
            </p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
              {typeof result?.semanticScore === "number"
                ? `${result.semanticScore}%`
                : "--"}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              Contextual match
            </p>
          </div>
        </aside>

        <section className="space-y-6 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
          <div
            className="rounded-2xl border p-6 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                  Summary
                </p>
                <h2 className="mt-2 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  Your fit assessment
                </h2>
              </div>
              <div
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: "var(--accent)", color: "#0f1117" }}
              >
                Level {result?.jdAnalysis?.level ?? "--"}
              </div>
            </div>

            {result?.aiSummary ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Strengths
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-sm" style={{ color: "var(--muted)" }}>
                    {result.aiSummary.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Gaps</p>
                  <ul className="mt-2 list-disc pl-5 text-sm" style={{ color: "var(--muted)" }}>
                    {result.aiSummary.gaps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm lg:col-span-2" style={{ color: "var(--muted)" }}>
                  Overall Fit:{" "}
                  <span className="font-medium" style={{ color: "var(--foreground)" }}>
                    {result.aiSummary.overallFit}
                  </span>
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                No AI summary available yet.
              </p>
            )}
          </div>

          <div
            className="rounded-2xl border p-6 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
              Skill Match
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Required Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {required.length ? (
                    required.map((skill) => <SkillTag key={skill} label={skill} />)
                  ) : (
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      No required skills extracted
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    Missing
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(result?.missingSkills?.required ?? []).length ? (
                      (result?.missingSkills?.required ?? []).map((skill) => (
                        <SkillTag key={skill} label={skill} variant="missing" />
                      ))
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>None</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Preferred Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {preferred.length ? (
                    preferred.map((skill) => <SkillTag key={skill} label={skill} />)
                  ) : (
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      No preferred skills extracted
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    Missing
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(result?.missingSkills?.preferred ?? []).length ? (
                      (result?.missingSkills?.preferred ?? []).map((skill) => (
                        <SkillTag key={skill} label={skill} variant="missing" />
                      ))
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 shadow-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
              How Semantic Scoring Works
            </p>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              Beyond keywords, we measure how closely your resume language aligns with the role's context. Higher scores mean your experience tells a similar story to the job description.
            </p>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              Your score:{" "}
              <span className="font-medium" style={{ color: "var(--accent)" }}>
                {typeof result?.semanticScore === "number"
                  ? `${result.semanticScore}%`
                  : "--"}
              </span>
            </p>
          </div>

          <div>
            <a
              href="/analyze"
              className="text-sm underline transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              Back to Analyze
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
