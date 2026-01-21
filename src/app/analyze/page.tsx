"use client";

import { extractSkillsFromResume } from "@/services/resumeAnalyzer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import JDInput from "@/components/JDInput";
import ResumeUploader from "@/components/ResumeUploader";

export default function AnalyzePage() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 font-sans">
      <h1 className="text-3xl font-semibold md:text-4xl" style={{ color: "var(--foreground)" }}>
        Analyze your fit
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
        Submit a job description and resume to see your match breakdown.
      </p>

      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <JDInput value={jdText} onChange={setJdText} />
          <ResumeUploader file={resumeFile} onChange={setResumeFile} />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "var(--accent)", color: "var(--button-text)" }}
          disabled={isLoading || jdText.trim().length === 0 || !resumeFile}
          onClick={async () => {
            if (!resumeFile) {
              setError("Please upload a resume file.");
              return;
            }

            setError(null);
            setIsLoading(true);

            try {
              const formData = new FormData();
              formData.append("jdText", jdText);
              formData.append("resume", resumeFile);

              const res = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                throw new Error(`API error: ${res.status} ${res.statusText}`);
              }

              const data = await res.json();
              sessionStorage.setItem("jobfit_result", JSON.stringify(data));
              router.push("/result");
            } catch (err: any) {
              setError(err.message ?? "An unexpected error occurred.");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>

        {error && (
          <p className="mt-3 text-sm" style={{ color: "var(--accent)" }}>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
