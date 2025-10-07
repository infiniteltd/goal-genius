"use client";

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

  const questionsRaw =
    (allQuestions as Record<string, Question[]>)?.[key] || [];

  const questions = useMemo<Question[]>(
    () =>
      shuffleArray(questionsRaw)
        .slice(0, 15)
        .map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        })),
    [key]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // reset timer and state when question changes
    setTimeLeft(20);
    setSelected(null);
  }, [index]);

  useEffect(() => {
    if (selected) return; // pause timer once user selects an answer

    if (timeLeft <= 0) {
      handleNext(); // move to next automatically
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">
          No questions found for the selected category/difficulty.
        </p>
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
    setFade(true);
    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= questions.length) {
        const params = new URLSearchParams({
          score: String(score),
          total: String(questions.length),
        });
        router.push(`/results?${params.toString()}`);
        return;
      }
      setIndex(nextIndex);
      setFade(false);
    }, 1000); // 1-second fade delay
  }

  const progressWidth = (timeLeft / 20) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 transition-all duration-500">
      <div
        className={`max-w-2xl mx-auto transition-opacity duration-700 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Question {index + 1} / {questions.length}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {category.replace("_", " ")} — {difficulty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-lg font-bold text-blue-700">{score}</p>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Time left</span>
            <span
              className={`text-sm font-semibold transition-all duration-300 ${
                timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-gray-800"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                timeLeft <= 5 ? "bg-red-600 animate-pulse" : "bg-blue-600"
              }`}
              style={{ width: `${progressWidth}%` }}
            ></div>
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
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transition ${
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
