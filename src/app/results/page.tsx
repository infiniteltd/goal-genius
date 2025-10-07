"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResultsContent() {
  const search = useSearchParams();
  const router = useRouter();
  const score = Number(search.get("score") || 0);
  const total = Number(search.get("total") || 0);

  function retry() {
    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-3">
          Quiz Complete!
        </h2>
        <p className="text-lg text-gray-600 mb-2">Your Score:</p>
        <div className="text-5xl font-extrabold text-green-600 mb-6">
          {score} / {total}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={retry}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold"
          >
            Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading results...</div>}
    >
      <ResultsContent />
    </Suspense>
  );
}
