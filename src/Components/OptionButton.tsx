"use client";

import React from "react";

type Props = {
  option: string;
  onClick: (option: string) => void;
  disabled?: boolean;
  isSelected?: boolean;
};

export default function OptionButton({
  option,
  onClick,
  disabled,
  isSelected,
}: Props) {
  return (
    <button
      onClick={() => onClick(option)}
      disabled={disabled}
      className={`w-full text-left px-4 py-3 rounded-md border transition 
        ${
          isSelected
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-white hover:bg-gray-50"
        }`}
    >
      {option}
    </button>
  );
}
