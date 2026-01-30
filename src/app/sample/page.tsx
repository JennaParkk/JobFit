"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import sampleResult from "@/data/sampleResult.json";

export default function SamplePage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem("jobfit_result", JSON.stringify(sampleResult));
    router.replace("/result");
  }, [router]);

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-6 py-24">
      <div className="animate-pulse text-center">
        <div className="mx-auto h-12 w-12 rounded-full border-4 border-coral-200 border-t-coral-500" />
        <p className="mt-4 text-stone-600">Loading sample result...</p>
      </div>
    </main>
  );
}
