import { Suspense } from "react";
import Link from "next/link";

async function TripDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-xl w-full bg-white border border-[#d3c4b9]/50 rounded-2xl p-8 shadow-sm space-y-6 text-center">
      <div className="inline-block px-3 py-1 rounded-full bg-[#ffd9b7] text-[#54381d] text-xs font-semibold">
        Protected Route: /trip/{id}
      </div>
      <h1 className="text-3xl font-serif font-bold text-[#54381d]">
        Trip Plan & Itinerary
      </h1>
      <p className="text-sm text-[#4f453c]">
        Trip ID:{" "}
        <code className="bg-[#f8f3ed] px-2 py-0.5 rounded text-xs text-[#54381d]">
          {id}
        </code>
      </p>
      <p className="text-xs text-[#81756b]">
        Foundation placeholder for 5-day itinerary, getting there, local transport, hotel stays, budget breakdown, map view, and edit mode.
      </p>

      <div className="pt-4 border-t border-[#d3c4b9]/40 flex gap-4 justify-center text-xs text-[#6e4f32]">
        <Link href="/home" className="hover:underline">
          Home
        </Link>
        <span>&bull;</span>
        <Link href="/trips" className="hover:underline">
          All Trips
        </Link>
        <span>&bull;</span>
        <Link href={`/shared/${id}`} className="hover:underline">
          View as Shared
        </Link>
      </div>
    </div>
  );
}

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <Suspense
        fallback={
          <div className="text-sm text-neutral-500">Loading trip details...</div>
        }
      >
        <TripDetailContent params={params} />
      </Suspense>
    </div>
  );
}
