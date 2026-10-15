export interface SkeletonCardProps {
  variant?: "trip" | "activity" | "list";
  className?: string;
}

export function SkeletonCard({
  variant = "trip",
  className = "",
}: SkeletonCardProps) {
  if (variant === "activity") {
    return (
      <div className={`relative flex flex-col my-4 animate-pulse ${className}`}>
        {/* Index placeholder */}
        <div className="absolute -left-4 sm:-left-6 top-6 w-8 h-8 rounded-full bg-[#e6e2dc] z-10"></div>
        <div className="ml-6 sm:ml-8 bg-white rounded-2xl p-6 border border-[#d3c4b9]/40 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#d3c4b9]/20">
            <div className="h-4 w-32 bg-[#e6e2dc] rounded-full"></div>
            <div className="h-4 w-20 bg-[#e6e2dc] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-5 h-44 bg-[#e6e2dc] rounded-xl"></div>
            <div className="md:col-span-7 space-y-3">
              <div className="h-6 w-3/4 bg-[#e6e2dc] rounded-lg"></div>
              <div className="h-4 w-full bg-[#e6e2dc] rounded-md"></div>
              <div className="h-4 w-5/6 bg-[#e6e2dc] rounded-md"></div>
              <div className="pt-4 flex justify-between">
                <div className="h-4 w-24 bg-[#e6e2dc] rounded-full"></div>
                <div className="h-4 w-16 bg-[#e6e2dc] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border border-[#d3c4b9]/40 shadow-sm animate-pulse ${className}`}>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#e6e2dc] shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-[#e6e2dc] rounded-lg"></div>
            <div className="h-3 w-64 bg-[#e6e2dc] rounded-md"></div>
          </div>
        </div>
        <div className="h-8 w-24 bg-[#e6e2dc] rounded-full shrink-0"></div>
      </div>
    );
  }

  // Default: Trip card grid
  return (
    <div className={`bg-white rounded-2xl p-5 border border-[#d3c4b9]/40 shadow-sm space-y-4 animate-pulse ${className}`}>
      <div className="w-full h-48 rounded-xl bg-[#e6e2dc]"></div>
      <div className="space-y-2">
        <div className="h-6 w-2/3 bg-[#e6e2dc] rounded-lg"></div>
        <div className="h-3.5 w-1/3 bg-[#e6e2dc] rounded-md"></div>
        <div className="h-3.5 w-1/2 bg-[#e6e2dc] rounded-md pt-1"></div>
      </div>
      <div className="pt-2 space-y-1.5">
        <div className="w-full h-1.5 rounded-full bg-[#e6e2dc]"></div>
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-[#e6e2dc] rounded-md"></div>
          <div className="h-3 w-16 bg-[#e6e2dc] rounded-md"></div>
        </div>
      </div>
      <div className="pt-3 border-t border-[#d3c4b9]/30 flex justify-between items-center">
        <div className="h-3 w-20 bg-[#e6e2dc] rounded-md"></div>
        <div className="h-4 w-16 bg-[#e6e2dc] rounded-full"></div>
      </div>
    </div>
  );
}
