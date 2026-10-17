import { Suspense } from "react";
import type { Metadata } from "next";
import { getSharedTrip } from "@/lib/sharedTripData";
import { SharedTripView } from "@/components/trip/SharedTripView";
import { SharedTripSkeleton } from "@/components/trip/SharedTripSkeleton";

export function generateStaticParams() {
  return [
    { shareId: "goa-coastal-odyssey" },
    { shareId: "goa-sun-2026" },
    { shareId: "kyoto-spring-2026" },
    { shareId: "spiti-high-pass" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;
  const { trip, isShared } = getSharedTrip(shareId);

  const destinationTitle = trip
    ? `${trip.destination}, ${trip.country}`
    : "Trip Plan";

  return {
    title: !trip
      ? "Trip Not Found (404) — TripAi"
      : !isShared
      ? "Trip Sharing Ended — TripAi"
      : `${destinationTitle} — Shared Trip Plan · TripAi`,
    description: trip
      ? `View the curated shared travel plan for ${destinationTitle}.`
      : "Shared trip plan view.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

async function SharedTripContent({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const result = getSharedTrip(shareId);

  return (
    <SharedTripView
      trip={result.trip}
      isShared={result.isShared}
      sharedBy={result.sharedBy}
      lastUpdated={result.lastUpdated}
      shareId={shareId}
    />
  );
}

export default function SharedTripPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  return (
    <Suspense fallback={<SharedTripSkeleton />}>
      <SharedTripContent params={params} />
    </Suspense>
  );
}
