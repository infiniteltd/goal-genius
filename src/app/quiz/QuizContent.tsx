"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionCard, { Question } from "../../Components/QuestionCard";
import { shuffleArray } from "../../util/shuffle";
import allQuestions from "../../data/questions.json";

export default function QuizContent() {
  const search = useSearchParams();
  const router = useRouter();
  const category = search.get("category") || "premier_league";
  const difficulty = search.get("difficulty") || "easy";
  const key = `${category}_${difficulty}`;

  const questionsRaw = (allQuestions as any)[key] || [];

  const questions = useMemo(
    () =>
      (questionsRaw as Question[]).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      })),
    [key]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setScore(0);
  }, [key]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>No questions found for the selected category/difficulty.</p>
      </div>
    );
  }

  const current = questions[index];

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Question {index + 1} / {questions.length}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {category.replace("_", " ")} — {difficulty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-lg font-extrabold text-blue-700">{score}</p>
          </div>
        </div>

        <QuestionCard
          q={current}
          selected={selected}
          onSelect={handleSelect}
          disabled={!!selected}
        />

        <div className="flex justify-end mt-6">
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition-all ${
              selected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {index + 1 >= questions.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
