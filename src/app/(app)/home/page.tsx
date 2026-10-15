import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <div className="max-w-xl w-full bg-white border border-[#d3c4b9]/50 rounded-2xl p-8 shadow-sm space-y-6 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-[#ffd9b7] text-[#54381d] text-xs font-semibold">
          Protected Route: /home
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#54381d]">
          Home Dashboard
        </h1>
        <p className="text-sm text-[#4f453c]">
          Foundation placeholder for TripAi Home: planner form, curated trips, explore by interest & season.
        </p>

        <div className="pt-4 border-t border-[#d3c4b9]/40 flex flex-wrap gap-2 justify-center text-xs">
          <Link href="/explore" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            Explore Results
          </Link>
          <Link href="/generating" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            Generating Screen
          </Link>
          <Link href="/trips" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            My Trips
          </Link>
          <Link href="/trip/trip-kyoto-5day" className="px-3 py-1.5 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d]">
            View Sample Trip (/trip/trip-kyoto-5day)
          </Link>
        </div>
      </div>
    </div>
  );
}
