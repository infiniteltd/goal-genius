"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuestionCard, { Question } from "@/Components/QuestionCard";

function QuizContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  // ✅ Load questions from sessionStorage (saved from HomePage)
  const questions: Question[] = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem("questions");
      return stored ? (JSON.parse(stored) as Question[]) : [];
    } catch {
      return [];
    }
  }, []);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledMap, setShuffledMap] = useState<Record<number, string[]>>({});

  const currentQuestion = questions[current];

  // ✅ Shuffle options only once per question
  useEffect(() => {
    if (!currentQuestion) return;

    setShuffledMap((prev) => {
      if (prev[current]) return prev; // already shuffled
      const shuffled = [...currentQuestion.options].sort(
        () => Math.random() - 0.5
      );
      return { ...prev, [current]: shuffled };
    });
  }, [currentQuestion, current]);

  const shuffledOptions =
    shuffledMap[current] || currentQuestion?.options || [];

  const handleSelect = (option: string) => {
    if (selected || showAnswer) return;
    setSelected(option);

    if (option === currentQuestion.answer) {
      setScore((s) => s + 1);
    }

    setShowAnswer(true); // stop timer + show feedback
  };

  // ✅ Timer logic (pauses when showAnswer is true)
  useEffect(() => {
    if (showAnswer) return; // pause timer when showing answer

    if (timeLeft <= 0) {
      // if time runs out, reveal answer but don't add score
      setShowAnswer(true);
      setSelected(null);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showAnswer]);

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
      setTimeLeft(20);
    } else {
      window.location.href = `/results?score=${score}&total=${questions.length}`;
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No questions available.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 transition-opacity duration-700">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
        {/* ✅ Header */}
        <div className="flex justify-between mb-4">
          <p className="text-lg font-medium text-gray-700">
            Question {current + 1} / {questions.length}
          </p>
          <p
            className={`text-lg font-semibold ${
              timeLeft <= 5 ? "text-red-600" : "text-blue-600"
            }`}
          >
            ⏳ {timeLeft}s
          </p>
        </div>

        {/* ✅ Question Card */}
        <QuestionCard
          q={{ ...currentQuestion, options: shuffledOptions }}
          selected={selected}
          onSelect={handleSelect}
          disabled={!!selected || showAnswer}
        />

        {/* ✅ Feedback */}
        {showAnswer && (
          <div className="mt-4 text-center">
            {selected === currentQuestion.answer ? (
              <p className="text-green-600 font-medium">✅ Correct!</p>
            ) : selected ? (
              <p className="text-red-600 font-medium">
                ❌ Wrong! The correct answer was:{" "}
                <span className="font-semibold text-green-700">
                  {currentQuestion.answer}
                </span>
              </p>
            ) : (
              <p className="text-orange-600 font-medium">
                ⏰ Time’s up! Correct answer:{" "}
                <span className="font-semibold text-green-700">
                  {currentQuestion.answer}
                </span>
              </p>
            )}
          </div>
        )}

        {/* ✅ Next Button */}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {current === questions.length - 1
              ? "Finish Quiz"
              : "Next Question →"}
          </button>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
}
