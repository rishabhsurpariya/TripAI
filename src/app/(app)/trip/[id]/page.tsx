import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TripPlanView } from "@/components/trip/TripPlanView";
import { getSampleTrip, USE_MOCK_DATA } from "@/lib/data/trips";
import { getTripServer as getTrip } from "@/lib/data/trips.server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    if (USE_MOCK_DATA) {
      const fallback = getSampleTrip();
      return {
        title: `${fallback.destination}, ${fallback.country} — Trip Plan & Itinerary · TripAi`,
        description: `Complete 5-day itinerary, hotel stays, transit and curated spots for ${fallback.destination}.`,
      };
    }
    return {
      title: "Trip Not Found · TripAi",
      description: "The requested travel itinerary was not found or is private.",
    };
  }

  return {
    title: `${trip.destination}, ${trip.country} — Trip Plan & Itinerary · TripAi`,
    description: `Complete ${trip.days?.length || 5}-day itinerary, hotel stays, transit and curated spots for ${trip.destination}.`,
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let trip = await getTrip(id);

  if (!trip) {
    if (USE_MOCK_DATA) {
      trip = getSampleTrip();
    } else {
      notFound();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface antialiased">
      {/* Logged-in App Navbar */}
      <Navbar />

      {/* Main Trip Plan Container */}
      <main className="w-full flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px] text-sm text-outline">
              Loading travel journal...
            </div>
          }
        >
          <TripPlanView trip={trip} />
        </Suspense>
      </main>
    </div>
  );
}
