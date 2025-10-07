"use client";

import React from "react";

type Props = {
  option: string;
  onClick: (option: string) => void;
  disabled?: boolean;
  isSelected?: boolean;
  customColor?: string;
};

export default function OptionButton({
  option,
  onClick,
  disabled,
  customColor = "bg-sky-100 text-gray-900 hover:bg-sky-200",
}: Props) {
  return (
    <button
      onClick={() => onClick(option)}
      disabled={disabled}
      className={`w-full text-left px-5 py-3 rounded-xl font-semibold border border-gray-300 transition-all duration-200
        ${customColor}
        ${disabled ? "opacity-90 cursor-not-allowed" : "hover:scale-[1.02]"}
      `}
    >
      {option}
    </button>
  );
}
