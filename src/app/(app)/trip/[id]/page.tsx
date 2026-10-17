import { Suspense } from "react";
import sampleItinerary from "@/data/sample-itinerary.json";
import tripsData from "@/data/trips.json";
import { Navbar } from "@/components/layout/Navbar";
import { TripPlanView } from "@/components/trip/TripPlanView";
import { Trip } from "@/types/trip";

function getTripData(id: string): Trip {
  // If the id matches sample-itinerary, use it directly
  if (id === sampleItinerary.id) {
    return sampleItinerary as unknown as Trip;
  }

  // Check if id matches a trip from trips.json
  const matchedTrip = (tripsData as unknown as Trip[]).find((t) => t.id === id);
  if (matchedTrip && matchedTrip.days && matchedTrip.days.length > 0) {
    return matchedTrip;
  }

  // If matched trip exists in trips.json but doesn't have days populated, merge with sample-itinerary days
  if (matchedTrip) {
    return {
      ...sampleItinerary,
      id: matchedTrip.id,
      destination: matchedTrip.destination,
      country: matchedTrip.country,
      coverImageUrl: matchedTrip.coverImageUrl || sampleItinerary.coverImageUrl,
      style: matchedTrip.style || sampleItinerary.style,
      startCity: matchedTrip.startCity || sampleItinerary.startCity,
      totalBudget: matchedTrip.totalBudget || sampleItinerary.totalBudget,
    } as unknown as Trip;
  }

  // Default to sample itinerary data
  return sampleItinerary as unknown as Trip;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = getTripData(id);
  return {
    title: `${trip.destination}, ${trip.country} — Trip Plan & Itinerary · TripAi`,
    description: `Complete 5-day itinerary, hotel stays, transit and curated spots for ${trip.destination}.`,
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = getTripData(id);

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
