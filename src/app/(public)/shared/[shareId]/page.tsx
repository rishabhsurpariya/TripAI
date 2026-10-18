import { Suspense } from "react";
import type { Metadata } from "next";
import { getSharedTrip } from "@/lib/data/sharing";
import { SharedTripView } from "@/components/trip/SharedTripView";
import { SharedTripSkeleton } from "@/components/trip/SharedTripSkeleton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;
  const { trip, isShared } = await getSharedTrip(shareId);

  const isAvailable = Boolean(trip && isShared);
  const destinationTitle =
    isAvailable && trip
      ? `${trip.destination}${trip.country ? `, ${trip.country}` : ""}`
      : "Trip Unavailable";

  return {
    title: !isAvailable
      ? "Trip Unavailable — TripAi"
      : `${destinationTitle} — Shared Trip Plan · TripAi`,
    description:
      isAvailable && trip
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
  const result = await getSharedTrip(shareId);

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
