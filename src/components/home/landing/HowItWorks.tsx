"use client";

import { Reveal, StaggerList } from "@/components/motion";

const steps = [
  {
    number: "1",
    icon: "🎛️",
    title: "Tell us",
    caption: "Tell us",
    content: (
      <div className="space-y-2.5 bg-[#f8f3ed] p-3.5 rounded-xl">
        <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg shadow-sm">
          <span className="text-secondary text-sm">📍</span>
          <span className="text-xs font-medium text-primary">Goa, India</span>
        </div>
        <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg shadow-sm">
          <span className="text-secondary text-sm">💳</span>
          <span className="text-xs font-medium text-primary">₹25,000 budget</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-medium">5 Days</span>
          <span className="px-2 py-0.5 rounded-full bg-[#d9c9ba]/50 text-primary text-[10px] font-medium">Cultural</span>
          <span className="px-2 py-0.5 rounded-full bg-[#d9c9ba]/50 text-primary text-[10px] font-medium">Relaxed</span>
        </div>
      </div>
    ),
    arrow: "→",
  },
  {
    number: "2",
    icon: "✨",
    title: "Get your plan",
    caption: "Get your plan",
    content: (
      <div className="relative bg-[#f8f3ed] p-3.5 rounded-xl h-36 flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute -top-3 w-4/5 h-10 bg-surface rounded-xl shadow-sm opacity-60" />
        <div className="w-full bg-surface rounded-xl p-3 shadow-md z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">Day 1: Old Heritage</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Optimized</span>
          </div>
          <div className="w-full h-1.5 bg-[#f2ede7] rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-primary-container rounded-full" />
          </div>
          <div className="text-[10px] text-secondary truncate">Se Cathedral → Fontainhas → Sunset Cruise</div>
        </div>
        <div className="absolute -bottom-2 w-3/4 h-8 bg-surface rounded-lg opacity-40" />
      </div>
    ),
    arrow: "→",
  },
  {
    number: "3",
    icon: "✏️",
    title: "Make it yours",
    caption: "Make it yours",
    content: (
      <div className="bg-[#f8f3ed] p-3.5 rounded-xl space-y-2">
        <div className="relative bg-[#fffae0] p-2.5 rounded-lg shadow-sm -rotate-2">
          <span className="font-handwriting text-base text-primary">Book Reis Magos sunset!</span>
          <span className="absolute top-1 right-1 text-secondary text-sm">⠿</span>
        </div>
        <div className="flex items-center justify-between bg-surface p-2 rounded-lg text-xs">
          <span className="text-primary font-medium flex items-center gap-1">
            🔗 Share link
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">Ready</span>
        </div>
      </div>
    ),
    arrow: null,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 px-4 bg-[#f2ede7]/60 rounded-3xl my-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-secondary font-medium">Simplicity</span>
            <h2
              className="text-3xl sm:text-4xl text-primary font-semibold mt-1 tracking-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              Three steps to your trip
            </h2>
          </div>
        </Reveal>

        {/* Connected path */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="hidden md:block absolute top-1/2 left-10 right-10 -translate-y-16 -z-0 pointer-events-none">
            <svg className="w-full h-12" fill="none" viewBox="0 0 800 48">
              <path d="M 20 24 Q 200 -8 400 24 T 780 24" stroke="#bba591" strokeDasharray="6 6" strokeWidth="2" />
            </svg>
            <span className="absolute right-4 top-1 text-primary text-xl rotate-45">✈</span>
          </div>

          <StaggerList className="contents">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_10px_25px_-8px_rgba(110,79,50,0.08)] flex flex-col justify-between relative z-10 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-full bg-[#f2ede7] text-primary flex items-center justify-center font-bold text-xs">
                      {step.number}
                    </span>
                    <span className="text-secondary text-lg">{step.icon}</span>
                  </div>
                  {step.content}
                </div>
                <div className="mt-6 pt-4 border-t border-[#bba591]/20 flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">{step.caption}</span>
                  <span className="text-secondary">{step.arrow ?? "✓"}</span>
                </div>
              </div>
            ))}
          </StaggerList>
        </div>
      </div>
    </section>
  );
}
