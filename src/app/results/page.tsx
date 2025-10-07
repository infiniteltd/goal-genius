"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResultsContent() {
  const search = useSearchParams();
  const router = useRouter();
  const score = Number(search.get("score") || 0);
  const total = Number(search.get("total") || 0);
  const q = search.get("q");
  const level = search.get("level");
  const category = search.get("category") || "";
  const difficulty = search.get("difficulty") || "";

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  function retry() {
    // ✅ Retry same category & difficulty
    const params = new URLSearchParams({
      category,
      difficulty,
    });
    router.push(`/quiz?${params.toString()}`);
  }

  async function shareResults() {
    const shareText = `🏆 I scored ${score}/${total} (${percentage}%) on Goal Genius! Can you beat my score? ⚽`;
    const shareUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Goal Genius Results",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share canceled or failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("📋 Link copied! Share it with your friends.");
    }
  }

  const getMessage = () => {
    if (percentage >= 80)
      return { text: "🌟 Excellent!", color: "text-green-600" };
    if (percentage >= 50)
      return { text: "👍 Good Job!", color: "text-yellow-600" };
    return { text: "💪 Keep Practicing!", color: "text-red-600" };
  };

  const message = getMessage();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>

        <h2 className="text-3xl font-extrabold text-indigo-700 mb-3">
          Quiz Complete!
        </h2>
        <p className="text-lg text-gray-600 mb-2">Your Score</p>

        {/* ✅ Circular Score Progress */}
        <div className="relative flex items-center justify-center mx-auto w-40 h-40 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#4f46e5"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-3xl font-extrabold text-indigo-700">
            {percentage}%
          </span>
        </div>

        {/* ✅ Performance Message */}
        <p className={`text-xl font-semibold mb-4 ${message.color}`}>
          {message.text}
        </p>

        {/* ✅ Summary Info */}
        <div className="bg-indigo-50 rounded-xl p-4 text-left mb-6">
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-700">
              Correct Answers:
            </span>{" "}
            {score}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-700">
              Total Questions:
            </span>{" "}
            {total}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-700">Accuracy:</span>{" "}
            {percentage}%
          </p>
          <p className="mt-2 text-sm text-gray-500 italic">
            {percentage >= 80
              ? "Outstanding performance! You really know your stuff."
              : percentage >= 50
              ? "Nice work! A bit more practice and you'll master it."
              : "Don't worry, keep learning — you'll improve in no time."}
          </p>
        </div>

        {/* ✅ Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={retry}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition-colors"
          >
            Home
          </button>
          <button
            onClick={shareResults}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
          >
            Share Results 🔗
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
