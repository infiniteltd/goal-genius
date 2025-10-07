"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultsPage() {
  const search = useSearchParams();
  const router = useRouter();
  const score = Number(search.get("score") || 0);
  const total = Number(search.get("total") || 0);

  function retry() {
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">
          🎉 Quiz Complete!
        </h2>
        <p className="text-lg text-gray-700 mb-4">You scored</p>
        <div className="text-5xl font-extrabold mb-6 text-blue-600">
          {score} / {total}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={retry}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-100 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </main>
  );
}
