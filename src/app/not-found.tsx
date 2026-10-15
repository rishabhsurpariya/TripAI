import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fef9f2] text-[#1d1b18]">
      <div className="max-w-md w-full bg-white border border-[#d3c4b9]/50 rounded-2xl p-8 shadow-sm space-y-6 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-semibold">
          404 &bull; Not Found
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#54381d]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#4f453c]">
          The itinerary or journey you are looking for does not exist or has been moved.
        </p>

        <div className="pt-4 border-t border-[#d3c4b9]/40 flex gap-4 justify-center text-xs text-[#6e4f32]">
          <Link href="/" className="hover:underline">Landing Page</Link>
          <span>&bull;</span>
          <Link href="/home" className="hover:underline">Home Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
