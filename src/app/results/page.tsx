"use client";

import React, { Suspense } from "react";
import ResultsContent from "./ResultsContent";

export default function ResultsPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading results...</div>}
    >
      <ResultsContent />
    </Suspense>
  );
}
