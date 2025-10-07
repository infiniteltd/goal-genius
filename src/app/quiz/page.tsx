"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionCard, { Question } from "../../Components/QuestionCard";
import { shuffleArray } from "../../util/shuffle";
import allQuestions from "../../data/questions.json";

function QuizContent() {
  const search = useSearchParams();
  const router = useRouter();

  const category = search.get("category") || "premier_league";
  const difficulty = search.get("difficulty") || "easy";
  const key = `${category}_${difficulty}`;

  // ✅ Explicitly type the question array
  const questionsRaw: Question[] =
    (allQuestions as Record<string, Question[]>)[key] || [];

  // ✅ Shuffle both questions and their options, fully typed
  const questions: Question[] = useMemo(() => {
    const shuffled = questionsRaw.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    return shuffleArray(shuffled).slice(0, 15);
  }, [key]);

  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setScore(0);
  }, [key]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        No questions found for the selected category/difficulty.
      </div>
    );
  }

  const current: Question = questions[index]; // ✅ Fully typed

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    const nextIndex = index + 1;
    setSelected(null);
    if (nextIndex >= questions.length) {
      const params = new URLSearchParams({
        score: String(score),
        total: String(questions.length),
      });
      router.push(`/results?${params.toString()}`);
      return;
    }
    setIndex(nextIndex);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-indigo-700">
              Question {index + 1} / {questions.length}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {category.replace("_", " ")} — {difficulty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-lg font-extrabold text-green-600">{score}</p>
          </div>
        </div>

        <QuestionCard
          q={current}
          selected={selected}
          onSelect={handleSelect}
          disabled={!!selected}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`px-5 py-2 rounded-xl font-semibold transition-colors ${
              selected
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {index + 1 >= questions.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
}
