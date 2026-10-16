import { PublicNavbar } from "@/components/layout/PublicNavbar";
import Hero from "@/components/home/landing/Hero";
import HowItWorks from "@/components/home/landing/HowItWorks";
import FeatureShowcase from "@/components/home/landing/FeatureShowcase";
import StickyNotesSection from "@/components/home/landing/StickyNotesSection";
import SampleTrips from "@/components/home/landing/SampleTrips";
import WorldMap from "@/components/home/landing/WorldMap";
import FinalCta from "@/components/home/landing/FinalCta";
import Footer from "@/components/home/landing/Footer";

export const metadata = {
  title: "TripAi — Your trip, planned in seconds",
  description: "Bespoke AI journey architect and travel itinerary planner. Enter a place and a budget, get your handcrafted route.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
      {/* Public Navbar */}
      <PublicNavbar />

      {/* Main Landing Page Content */}
      <main className="w-full flex-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Hero />
        <HowItWorks />
        <FeatureShowcase />
        <StickyNotesSection />
        <SampleTrips />
        <WorldMap />
        <FinalCta />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
