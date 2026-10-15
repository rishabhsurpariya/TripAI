"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("TripAi runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <div className="max-w-md w-full bg-white border border-[#ba1a1a]/30 rounded-2xl p-8 shadow-sm space-y-6 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-semibold">
          Error Encountered
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#ba1a1a]">
          Something Went Wrong
        </h1>
        <p className="text-sm text-[#4f453c]">
          An unexpected error occurred while loading this view.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] text-xs font-semibold"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1] text-xs font-semibold flex items-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
