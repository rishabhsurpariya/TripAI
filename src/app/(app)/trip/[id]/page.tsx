import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { TripPlanView } from "@/components/trip/TripPlanView";
import { getTrip, getSampleTrip } from "@/lib/data/trips";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = (await getTrip(id)) || getSampleTrip();
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
  const trip = (await getTrip(id)) || getSampleTrip();

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
