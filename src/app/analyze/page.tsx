"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    
    if (!jdText.trim()) {
      setError("Please paste a job description");
      return;
    }
    
    if (!resumeFile) {
      setError("Please upload your resume");
      return;
    }

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("jdText", jdText);
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.ok) {
        sessionStorage.setItem("jobfit_result", JSON.stringify(result));
        router.push("/result");
      } else {
        setError(result.error || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isReady = jdText.trim() && resumeFile;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-stone-950">
          Analyze Your Match
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
          Upload your resume and paste the job description to see how well you align.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mt-12 mb-10">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
              resumeFile 
                ? "border-emerald-500 bg-emerald-500 text-white" 
                : "border-stone-300 bg-white text-stone-400"
            }`}>
              {resumeFile ? "✓" : "1"}
            </div>
            <span className={`text-sm font-medium ${resumeFile ? "text-stone-900" : "text-stone-500"}`}>
              Upload Resume
            </span>
          </div>
          
          <div className={`h-0.5 w-12 transition-all ${
            resumeFile ? "bg-emerald-500" : "bg-stone-200"
          }`} />
          
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
              jdText.trim() 
                ? "border-emerald-500 bg-emerald-500 text-white" 
                : "border-stone-300 bg-white text-stone-400"
            }`}>
              {jdText.trim() ? "✓" : "2"}
            </div>
            <span className={`text-sm font-medium ${jdText.trim() ? "text-stone-900" : "text-stone-500"}`}>
              Add Job Description
            </span>
          </div>
          
          <div className={`h-0.5 w-12 transition-all ${
            isReady ? "bg-emerald-500" : "bg-stone-200"
          }`} />
          
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
              isReady 
                ? "border-coral-500 bg-coral-500 text-white" 
                : "border-stone-300 bg-white text-stone-400"
            }`}>
              3
            </div>
            <span className={`text-sm font-medium ${isReady ? "text-stone-900" : "text-stone-500"}`}>
              Analyze
            </span>
          </div>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Resume Upload */}
        <div className="group relative">
          <div className={`rounded-2xl border-2 border-dashed bg-white p-8 transition-all ${
            resumeFile 
              ? "border-emerald-300 bg-emerald-50/50" 
              : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
          }`}>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral-500 to-peach-400">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                Upload Your Resume
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                PDF format only
              </p>

              <label className="mt-6 inline-block">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <span className="cursor-pointer rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 shadow-sm transition hover:bg-stone-50 hover:border-stone-400">
                  {resumeFile ? "Change File" : "Choose File"}
                </span>
              </label>

              {resumeFile && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{resumeFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="group relative">
          <div className={`rounded-2xl border-2 bg-white transition-all ${
            jdText.trim() 
              ? "border-emerald-300 bg-emerald-50/50" 
              : "border-stone-200"
          }`}>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-peach-400 to-coral-500">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Job Description
                  </h3>
                  <p className="text-sm text-stone-600">
                    Paste the full text
                  </p>
                </div>
              </div>

              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the complete job description here...

Include requirements, qualifications, and responsibilities for the best match analysis."
                className="w-full resize-none rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-coral-300 focus:outline-none focus:ring-4 focus:ring-coral-100 transition-all"
                rows={12}
              />

              {jdText.trim() && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    {jdText.split(/\s+/).filter(w => w.length > 0).length} words
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-rose-900">{error}</p>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleAnalyze}
          disabled={!isReady || isAnalyzing}
          className={`group relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold shadow-lg transition-all ${
            isReady && !isAnalyzing
              ? "bg-gradient-to-r from-coral-500 to-rose-500 text-white hover:shadow-xl hover:scale-105"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {isAnalyzing ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing your match...
            </>
          ) : (
            <>
              <span>Analyze Match</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        {!isReady && (
          <p className="mt-4 text-sm text-stone-500">
            Complete both steps above to analyze your match
          </p>
        )}
      </div>
    </main>
  );
}