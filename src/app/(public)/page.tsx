import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <div className="max-w-xl w-full bg-white border border-[#d3c4b9]/50 rounded-2xl p-8 shadow-sm space-y-6 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-[#ffd9b7] text-[#54381d] text-xs font-semibold">
          Public Route: /
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#54381d]">Landing Page</h1>
        <p className="text-sm text-[#4f453c]">
          Foundation placeholder for TripAi landing page.
        </p>

        <div className="pt-4 border-t border-[#d3c4b9]/40 flex flex-wrap gap-2 justify-center text-xs">
          <Link href="/login" className="px-3 py-1.5 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d]">
            Login
          </Link>
          <Link href="/signup" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            Sign Up
          </Link>
          <Link href="/home" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            Home (Protected)
          </Link>
          <Link href="/trips" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            My Trips
          </Link>
          <Link href="/trip/trip-kyoto-5day" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            Sample Trip
          </Link>
          <Link href="/shared/kyoto-spring-2026" className="px-3 py-1.5 rounded-full bg-[#f2ede7] text-[#54381d] hover:bg-[#ece7e1]">
            Shared Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
