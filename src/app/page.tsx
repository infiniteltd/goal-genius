"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import rawQuestions from "../data/questions.json";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type AllQuestions = {
  [key: string]: Question[];
};

const allQuestions = rawQuestions as AllQuestions;

const categories = [
  { key: "premier_league", label: "Premier League" },
  { key: "la_liga", label: "La Liga" },
  { key: "serie_a", label: "Serie A" },
  { key: "bundesliga", label: "Bundesliga" },
  { key: "l1", label: "Ligue 1" },
  { key: "ed", label: "Eredivisie" },
  { key: "ucl", label: "Champions League" },
  { key: "int", label: "International / World Cup" },
];

const difficulties = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

export default function HomePage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("premier_league");
  const [difficulty, setDifficulty] = useState<string>("easy");

  function startQuiz() {
    const key = `${category}_${difficulty}`;
    const selectedQuestions: Question[] = allQuestions[key] ?? [];

    if (!selectedQuestions.length) {
      alert("No questions found for this category and difficulty!");
      return;
    }

    // Save questions to sessionStorage
    sessionStorage.setItem("questions", JSON.stringify(selectedQuestions));

    // Navigate with query params
    const params = new URLSearchParams({ category, difficulty });
    router.push(`/quiz?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Goal Genius</h1>
        <p className="mb-6 text-gray-700">
          Pick a category and difficulty to start the quiz.
        </p>

        <label className="block mb-2 text-gray-800 font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((c) => (
            <option value={c.key} key={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-gray-800 font-medium">
          Difficulty
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {difficulties.map((d) => (
            <option value={d.key} key={d.key}>
              {d.label}
            </option>
          ))}
        </select>

        <button
          onClick={startQuiz}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </main>
  );
}
