import { Navbar } from "@/components/layout/Navbar";
import { TripPlannerForm } from "@/components/home/TripPlannerForm";
import { CuratedTripsSection } from "@/components/home/CuratedTripsSection";
import { ExploreByInterestSection } from "@/components/home/ExploreByInterestSection";
import { ExploreBySeasonSection } from "@/components/home/ExploreBySeasonSection";

export const metadata = {
  title: "TripAi — Home Dashboard & Trip Planner",
  description: "Plan bespoke AI travel itineraries tailored to your cadence and curiosities.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f2ec] text-on-surface antialiased">
      {/* Logged-in Navbar */}
      <Navbar />

      {/* Main Container without footer */}
      <main className="w-full flex-1 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <TripPlannerForm />
        <CuratedTripsSection />
        <ExploreByInterestSection />
        <ExploreBySeasonSection />
      </main>
    </div>
  );
}
