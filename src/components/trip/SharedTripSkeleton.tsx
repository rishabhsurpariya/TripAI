"use client";

export function SharedTripSkeleton() {
  return (
    <div className="w-full flex flex-col flex-1 animate-pulse">
      {/* 1. Shared By Banner Skeleton */}
      <div className="w-full bg-[#d9c9ba]/40 border-b border-[#bba591]/40 py-2.5 px-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#bba591]/60" />
            <div className="h-4 w-48 bg-[#bba591]/50 rounded" />
          </div>
          <div className="h-4 w-32 bg-[#bba591]/40 rounded-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-20">
        {/* 2. Hero Card Skeleton */}
        <div className="w-full rounded-3xl bg-[#2d2218]/90 p-6 sm:p-9 min-h-[290px] flex flex-col justify-between mb-8 border border-[#bba591]/30">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-36 bg-[#8c6e52]/60 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 bg-[#8c6e52]/40 rounded-full" />
              <div className="h-6 w-32 bg-[#8c6e52]/40 rounded-full" />
            </div>
          </div>

          <div className="my-6 space-y-3">
            <div className="h-3 w-40 bg-[#8c6e52]/50 rounded" />
            <div className="h-9 w-3/4 max-w-md bg-[#8c6e52]/70 rounded-xl" />
            <div className="h-4 w-full max-w-xl bg-[#8c6e52]/40 rounded" />
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-20 bg-[#8c6e52]/50 rounded-full" />
              <div className="h-7 w-24 bg-[#8c6e52]/50 rounded-full" />
              <div className="h-7 w-28 bg-[#8c6e52]/50 rounded-full" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-28 bg-[#8c6e52]/50 rounded-full" />
              <div className="h-9 w-44 bg-[#8c6e52]/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* 3. Tab Bar Skeleton */}
        <div className="h-10 w-full bg-[#d9c9ba]/30 rounded-full mb-8 flex items-center gap-2 px-3">
          <div className="h-7 w-28 bg-[#bba591]/60 rounded-full" />
          <div className="h-7 w-24 bg-[#bba591]/40 rounded-full" />
          <div className="h-7 w-28 bg-[#bba591]/40 rounded-full" />
          <div className="h-7 w-20 bg-[#bba591]/40 rounded-full" />
          <div className="h-7 w-20 bg-[#bba591]/40 rounded-full" />
        </div>

        {/* 4. Two Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Itinerary Skeleton (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Day Header Skeleton */}
            <div className="space-y-2 pb-3 border-b border-[#bba591]/30">
              <div className="h-4 w-40 bg-[#d9c9ba]/60 rounded" />
              <div className="h-7 w-80 bg-[#d9c9ba]/70 rounded-lg" />
            </div>

            {/* Activity Card Skeletons */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bba591]/40 shadow-sm flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-48 h-36 bg-[#f1eae2] rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-[#d9c9ba]/50 rounded-full" />
                    <div className="h-4 w-20 bg-[#d9c9ba]/40 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-[#d9c9ba]/70 rounded" />
                  <div className="h-3 w-full bg-[#d9c9ba]/40 rounded" />
                  <div className="h-3 w-5/6 bg-[#d9c9ba]/40 rounded" />
                  <div className="pt-2 border-t border-[#bba591]/20 flex justify-between">
                    <div className="h-4 w-28 bg-[#d9c9ba]/50 rounded" />
                    <div className="h-4 w-28 bg-[#d9c9ba]/40 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Panel Skeleton (4 cols) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
            <div className="bg-white rounded-3xl p-5 border border-[#bba591]/40 shadow-sm space-y-4">
              <div className="h-5 w-40 bg-[#d9c9ba]/70 rounded" />
              <div className="h-8 w-32 bg-[#d9c9ba]/80 rounded" />
              <div className="h-2.5 w-full bg-[#f1eae2] rounded-full" />
              <div className="space-y-2.5 pt-3 border-t border-[#bba591]/20">
                <div className="h-4 w-full bg-[#d9c9ba]/40 rounded" />
                <div className="h-4 w-full bg-[#d9c9ba]/40 rounded" />
                <div className="h-4 w-full bg-[#d9c9ba]/40 rounded" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#bba591]/40 shadow-sm space-y-3">
              <div className="h-5 w-36 bg-[#d9c9ba]/70 rounded" />
              <div className="h-44 w-full bg-[#e8e2d8] rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
