"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionCard, { Question } from "../../Components/QuestionCard";
import { shuffleArray } from "../../util/shuffle";
import allQuestions from "../../data/questions.json";

export default function QuizPage() {
  const search = useSearchParams();
  const router = useRouter();
  const category = search.get("category") || "premier_league";
  const difficulty = search.get("difficulty") || "easy";
  const key = `${category}_${difficulty}`;

  // Load questions for the chosen key

  const questionsRaw: Question[] =
    (allQuestions as Record<string, Question[]>)[key] || [];

  // Shuffle questions and their options once per quiz
  const questions = useMemo<Question[]>(() => {
    return shuffleArray(questionsRaw)
      .slice(0, 15)
      .map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
  }, [key]);

  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // reset when category/difficulty changes
    setIndex(0);
    setSelected(null);
    setScore(0);
  }, [key]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50">
        <p className="text-lg text-gray-700">
          No questions found for the selected category/difficulty.
        </p>
      </div>
    );
  }

  const current = questions[index];

  function handleSelect(option: string) {
    if (selected) return; // prevent reselect
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    const nextIndex = index + 1;
    setSelected(null);
    if (nextIndex >= questions.length) {
      // go to results
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
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-md">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Question {index + 1} / {questions.length}
            </h2>
          </div>
          <div className="text-right bg-gray-100 px-4 py-2 rounded-lg shadow-inner">
            <p className="text-sm text-gray-700 font-medium">Score</p>
            <p className="text-xl font-bold text-blue-600">{score}</p>
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
            className={`px-6 py-3 rounded-xl font-semibold transition-colors shadow-md ${
              selected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {index + 1 >= questions.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
