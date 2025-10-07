"use client";

import React from "react";
import OptionButton from "./OptionButton";

export type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

type Props = {
  q: Question;
  selected?: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
};

export default function QuestionCard({
  q,
  selected,
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900">{q.question}</h3>
      <div className="grid gap-4">
        {q.options.map((opt) => {
          // Determine the button color
          let bgColor = "bg-blue-100 text-gray-900"; // default
          if (selected === opt) {
            bgColor =
              selected === q.answer
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white";
          }

          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              disabled={disabled}
              className={`p-3 rounded-lg font-medium transition-colors ${bgColor} hover:brightness-110`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
