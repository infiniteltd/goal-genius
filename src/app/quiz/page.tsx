"use client";

import React, { Suspense } from "react";
import QuizContent from "./QuizContent";

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="text-center p-10">Loading quiz...</div>}
    >
      <QuizContent />
    </Suspense>
  );
}
