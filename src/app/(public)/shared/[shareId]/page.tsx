import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shared Trip Plan — TripAi",
  robots: {
    index: false,
    follow: false,
  },
};

async function SharedTripContent({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  return (
    <div className="max-w-md w-full bg-white border border-[#d3c4b9]/50 rounded-2xl p-8 shadow-sm space-y-6 text-center">
      <div className="inline-block px-3 py-1 rounded-full bg-[#ffd9b7] text-[#54381d] text-xs font-semibold">
        Public Route: /shared/{shareId}
      </div>
      <h1 className="text-3xl font-serif font-bold text-[#54381d]">
        Shared Trip Plan (Read-Only)
      </h1>
      <p className="text-sm text-[#4f453c]">
        Share ID:{" "}
        <code className="bg-[#f8f3ed] px-2 py-0.5 rounded text-xs text-[#54381d]">
          {shareId}
        </code>
      </p>

      <div className="pt-4 border-t border-[#d3c4b9]/40 flex gap-4 justify-center text-xs text-[#6e4f32]">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>&bull;</span>
        <Link href="/login" className="hover:underline">
          Login to Create Yours
        </Link>
      </div>
    </div>
  );
}

export default function SharedTripPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <Suspense
        fallback={
          <div className="text-sm text-neutral-500">Loading shared trip...</div>
        }
      >
        <SharedTripContent params={params} />
      </Suspense>
    </div>
  );
}
