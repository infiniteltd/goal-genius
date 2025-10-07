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
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">{q.question}</h3>
      <div className="grid gap-4">
        {q.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.answer;
          const showColors = disabled && selected;

          let color = "bg-sky-100 text-gray-900 hover:bg-sky-200"; // default blue tone

          if (showColors) {
            if (isSelected && isCorrect)
              color =
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
            else if (isSelected && !isCorrect)
              color = "bg-gradient-to-r from-rose-500 to-red-600 text-white";
            else if (!isSelected && isCorrect)
              color = "bg-green-100 text-green-900 border-green-400";
            else color = "bg-gray-100 text-gray-800";
          }

          return (
            <OptionButton
              key={opt}
              option={opt}
              onClick={onSelect}
              disabled={disabled}
              isSelected={isSelected}
              customColor={color}
            />
          );
        })}
      </div>
    </div>
  );
}
