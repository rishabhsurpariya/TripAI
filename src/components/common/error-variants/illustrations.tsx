"use client";

import React from "react";

interface IllustrationProps {
  className?: string;
  isMobile?: boolean;
}

/**
 * 01 · 404: Paper plane flying off folded map with question mark and sticky note
 */
export function PlaneMapIllustration({ className = "", isMobile = false }: IllustrationProps) {
  if (isMobile) {
    return (
      <div className={`relative w-56 h-44 flex items-center justify-center ${className}`}>
        <svg className="w-44 h-32" viewBox="0 0 240 160" fill="none" aria-hidden="true">
          <polygon points="20,30 90,18 90,140 20,150" fill="#d9c9ba" stroke="#bba591" strokeWidth="1.75" />
          <polygon points="90,18 160,32 160,152 90,140" fill="#e7ded4" stroke="#bba591" strokeWidth="1.75" />
          <polygon points="160,32 220,20 220,138 160,152" fill="#d9c9ba" stroke="#bba591" strokeWidth="1.75" />
          <path d="M110,105 Q145,85 155,50 T220,35 T250,20" stroke="#a28973" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        </svg>
        <div className="absolute -top-1 right-2 anim-drift">
          <svg className="w-10 h-10 text-[#6e4f32]" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M12 48 L56 12 L34 54 L26 36 L12 48 Z" fill="#ffffff" stroke="#6e4f32" strokeWidth="2" strokeLinejoin="round" />
            <path d="M26 36 L56 12" stroke="#6e4f32" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute -bottom-1 left-2 rotate-[-6deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-2.5 py-1 shadow-sm">
          <p className="font-script text-[#6e4f32] text-sm">Wrong turn?</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Folded map SVG */}
      <svg className="w-56 h-40 filter drop-shadow-sm" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Folded map panels */}
        <polygon points="20,30 90,18 90,140 20,150" fill="#d9c9ba" stroke="#bba591" strokeWidth="1.75" />
        <polygon points="90,18 160,32 160,152 90,140" fill="#e7ded4" stroke="#bba591" strokeWidth="1.75" />
        <polygon points="160,32 220,20 220,138 160,152" fill="#d9c9ba" stroke="#bba591" strokeWidth="1.75" />
        {/* Map contour terrain lines */}
        <path d="M35,60 Q60,75 80,50" stroke="#bba591" strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
        <path d="M100,55 Q125,40 150,65" stroke="#bba591" strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
        <path d="M170,70 Q195,50 210,80" stroke="#bba591" strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
        {/* Compass rose watermark */}
        <circle cx="60" cy="115" r="14" stroke="#bba591" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />
        <line x1="60" y1="97" x2="60" y2="133" stroke="#bba591" strokeWidth="1" opacity="0.6" />
        <line x1="42" y1="115" x2="78" y2="115" stroke="#bba591" strokeWidth="1" opacity="0.6" />
        {/* Dotted flight route escaping the map */}
        <path d="M110,105 Q145,85 155,50 T220,35 T250,20" stroke="#a28973" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      </svg>

      {/* Floating Paper Plane (Animated Drift) */}
      <div className="absolute -top-1 -right-2 anim-drift">
        <svg className="w-14 h-14 text-[#6e4f32] filter drop-shadow-md" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M12 48 L56 12 L34 54 L26 36 L12 48 Z" fill="#ffffff" stroke="#6e4f32" strokeWidth="2" strokeLinejoin="round" />
          <path d="M26 36 L56 12" stroke="#6e4f32" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 36 L30 46 L34 38" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Gentle question mark where path drifts away */}
      <span className="absolute top-4 right-14 text-[#a28973] text-lg font-serif italic select-none">?</span>

      {/* Tactile Sticky Note: "Wrong turn?" */}
      <div className="absolute -bottom-2 -left-3 rotate-[-6deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3.5 py-2 shadow-md filter drop-shadow-sm">
        <div className="w-5 h-1.5 bg-[#bba591]/40 mx-auto -mt-3 mb-1 rounded-full opacity-60"></div>
        <p className="font-script text-[#6e4f32] text-base leading-none">Wrong turn?</p>
      </div>
    </div>
  );
}

/**
 * 02 · 500: Suitcase with loose undone strap and comical cloud
 */
export function SuitcaseCloudIllustration({ className = "", isMobile = false }: IllustrationProps) {
  if (isMobile) {
    return (
      <div className={`relative w-56 h-44 flex items-center justify-center ${className}`}>
        <div className="absolute -top-1 left-4 anim-cloud opacity-80">
          <svg className="w-20 h-12 text-[#d9c9ba]" viewBox="0 0 100 50" fill="currentColor" aria-hidden="true">
            <path d="M20 40 A15 15 0 0 1 35 15 A20 20 0 0 1 70 18 A14 14 0 0 1 85 40 Z" />
          </svg>
        </div>
        <svg className="w-44 h-36 z-10" viewBox="0 0 200 150" fill="none" aria-hidden="true">
          <rect x="35" y="45" width="130" height="90" rx="14" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="2" />
          <rect x="43" y="53" width="114" height="74" rx="8" fill="#faf6f0" stroke="#bba591" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M80 45 V30 C80 25 86 20 94 20 H106 C114 20 120 25 120 30 V45" stroke="#6e4f32" strokeWidth="2.5" fill="none" />
          <line x1="68" y1="45" x2="68" y2="135" stroke="#8c6e52" strokeWidth="2" />
          <path d="M132 45 V90 C132 110 148 115 152 130 C154 138 148 145 142 145" stroke="#8c6e52" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="100" cy="90" r="10" stroke="#bba591" strokeWidth="1" strokeDasharray="2 2" fill="#f7f2ec" />
        </svg>
        <div className="absolute bottom-1 right-3 rotate-[4deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-2.5 py-1 shadow-sm">
          <p className="font-script text-[#6e4f32] text-sm">bumpy road</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Calming comical cloud */}
      <div className="absolute -top-2 left-6 anim-cloud opacity-85">
        <svg className="w-28 h-16 text-[#d9c9ba]" viewBox="0 0 100 50" fill="currentColor" aria-hidden="true">
          <path d="M20 40 A15 15 0 0 1 35 15 A20 20 0 0 1 70 18 A14 14 0 0 1 85 40 Z" />
        </svg>
      </div>

      {/* Suitcase Line Art with soft fills */}
      <svg className="w-56 h-44 z-10" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Suitcase Main Body */}
        <rect x="35" y="45" width="130" height="90" rx="14" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="2" />
        {/* Inner accent panel */}
        <rect x="43" y="53" width="114" height="74" rx="8" fill="#faf6f0" stroke="#bba591" strokeWidth="1.2" strokeDasharray="3 3" />
        {/* Suitcase Handle */}
        <path d="M80 45 V30 C80 25 86 20 94 20 H106 C114 20 120 25 120 30 V45" stroke="#6e4f32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Protective corner caps */}
        <path d="M35 60 C35 52 42 45 50 45" stroke="#8c6e52" strokeWidth="2" />
        <path d="M165 60 C165 52 158 45 150 45" stroke="#8c6e52" strokeWidth="2" />
        <path d="M35 120 C35 128 42 135 50 135" stroke="#8c6e52" strokeWidth="2" />
        <path d="M165 120 C165 128 158 135 150 135" stroke="#8c6e52" strokeWidth="2" />
        {/* Vintage Straps */}
        <line x1="68" y1="45" x2="68" y2="135" stroke="#8c6e52" strokeWidth="2" />
        {/* Loose undone strap drooping whimsically */}
        <path d="M132 45 V90 C132 110 148 115 152 130 C154 138 148 145 142 145" stroke="#8c6e52" strokeWidth="2.2" strokeLinecap="round" />
        {/* Buckle on fixed strap */}
        <rect x="64" y="85" width="8" height="12" rx="2" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="1.5" />
        <rect x="128" y="75" width="8" height="12" rx="2" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="1.5" />
        {/* Little travel stamp on suitcase */}
        <circle cx="100" cy="90" r="12" stroke="#bba591" strokeWidth="1" strokeDasharray="2 2" fill="#f7f2ec" />
        <text x="100" y="93" fontFamily="serif" fontSize="8" fill="#a28973" textAnchor="middle">PARIS</text>
      </svg>

      {/* Sticky Note on luggage */}
      <div className="absolute bottom-1 right-2 rotate-[4deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md z-20">
        <p className="font-script text-[#6e4f32] text-sm leading-none">bumpy road</p>
      </div>
    </div>
  );
}

/**
 * 03 · Trip couldn't be generated: Compass with wobbling needle over blank itinerary card
 */
export function CompassCardIllustration({ className = "" }: IllustrationProps) {
  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Blank itinerary card background with delicate lines */}
      <div className="absolute w-52 h-36 bg-white border border-[#bba591]/50 rounded-2xl shadow-sm rotate-[-3deg] p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-[#bba591]/20 pb-2">
          <div className="w-20 h-2 bg-[#d9c9ba] rounded-full"></div>
          <div className="w-8 h-2 bg-[#d9c9ba]/60 rounded-full"></div>
        </div>
        <div className="w-3/4 h-2 bg-[#d9c9ba]/40 rounded-full"></div>
        <div className="w-1/2 h-2 bg-[#d9c9ba]/30 rounded-full"></div>
        <div className="mt-auto flex gap-2">
          <div className="w-6 h-6 rounded-md bg-[#d9c9ba]/40"></div>
          <div className="flex-1 flex flex-col justify-center gap-1">
            <div className="w-24 h-1.5 bg-[#d9c9ba]/50 rounded-full"></div>
            <div className="w-16 h-1.5 bg-[#d9c9ba]/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Compass sitting in foreground */}
      <div className="relative z-10 w-32 h-32 rounded-full bg-[#f7f2ec] border-2 border-[#6e4f32] shadow-md flex items-center justify-center">
        {/* Compass dial marks */}
        <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle cx="50" cy="50" r="42" stroke="#bba591" strokeWidth="1" strokeDasharray="2 3" />
          <text x="50" y="16" fontFamily="sans-serif" fontSize="7" fontWeight="600" fill="#6e4f32" textAnchor="middle">N</text>
          <text x="86" y="52" fontFamily="sans-serif" fontSize="7" fontWeight="600" fill="#a28973" textAnchor="middle">E</text>
          <text x="50" y="90" fontFamily="sans-serif" fontSize="7" fontWeight="600" fill="#a28973" textAnchor="middle">S</text>
          <text x="14" y="52" fontFamily="sans-serif" fontSize="7" fontWeight="600" fill="#a28973" textAnchor="middle">W</text>
        </svg>
        {/* Wobbling Needle */}
        <div className="relative w-full h-full flex items-center justify-center anim-wobble">
          <svg className="w-12 h-20" viewBox="0 0 24 50" fill="none" aria-hidden="true">
            <polygon points="12,2 17,25 7,25" fill="#6e4f32" stroke="#6e4f32" strokeWidth="1" />
            <polygon points="12,48 17,25 7,25" fill="#d9c9ba" stroke="#a28973" strokeWidth="1" />
            <circle cx="12" cy="25" r="2.5" fill="#faf6f0" stroke="#6e4f32" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Sticky Note */}
      <div className="absolute -bottom-2 right-4 rotate-[6deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md z-20">
        <p className="font-script text-[#6e4f32] text-sm leading-none">let&apos;s recalibrate</p>
      </div>
    </div>
  );
}

/**
 * 04 · Offline / No connection: Tethered hot-air balloon with broken signal icon
 */
export function BalloonTetherIllustration({ className = "" }: IllustrationProps) {
  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Tethered Hot Air Balloon SVG */}
      <div className="anim-balloon">
        <svg className="w-48 h-48" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Balloon Envelope */}
          <path d="M80 15 C50 15 30 38 30 65 C30 88 50 108 72 118 L88 118 C110 108 130 88 130 65 C130 38 110 15 80 15 Z" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="2" />
          {/* Vertical Gores / Striping in taupe & cream */}
          <path d="M80 15 C65 15 52 40 52 65 C52 92 68 115 76 118" stroke="#bba591" strokeWidth="1.5" fill="none" />
          <path d="M80 15 C95 15 108 40 108 65 C108 92 92 115 84 118" stroke="#bba591" strokeWidth="1.5" fill="none" />
          {/* Ropes */}
          <line x1="72" y1="118" x2="70" y2="132" stroke="#8c6e52" strokeWidth="1.2" />
          <line x1="88" y1="118" x2="90" y2="132" stroke="#8c6e52" strokeWidth="1.2" />
          {/* Wicker Basket */}
          <rect x="68" y="132" width="24" height="18" rx="3" fill="#bba591" stroke="#6e4f32" strokeWidth="1.8" />
          <line x1="74" y1="132" x2="74" y2="150" stroke="#6e4f32" strokeWidth="1" />
          <line x1="86" y1="132" x2="86" y2="150" stroke="#6e4f32" strokeWidth="1" />
          <line x1="68" y1="141" x2="92" y2="141" stroke="#6e4f32" strokeWidth="1" />
          {/* Tethering ground stake & rope */}
          <path d="M80 150 L80 160" stroke="#8c6e52" strokeWidth="2" />
          <line x1="65" y1="160" x2="95" y2="160" stroke="#a28973" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Small broken signal icon beside balloon */}
      <div className="absolute top-6 right-8 bg-white/90 border border-[#bba591]/40 p-2 rounded-xl shadow-sm anim-pulse">
        <svg className="w-6 h-6 text-[#8c6e52]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      {/* Sticky note on base */}
      <div className="absolute bottom-0 left-6 rotate-[-4deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md">
        <p className="font-script text-[#6e4f32] text-sm leading-none">waiting for a breeze</p>
      </div>
    </div>
  );
}

/**
 * 05 · Session Expired: Luggage tag with small lock charm
 */
export function LuggageTagLockIllustration({ className = "" }: IllustrationProps) {
  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Vintage Leather Luggage Tag SVG */}
      <svg className="w-48 h-48 filter drop-shadow-sm" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Leather loop strap */}
        <path d="M80 15 C80 5 95 5 95 25 C95 40 85 45 80 50" stroke="#8c6e52" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="50" r="4" fill="#faf6f0" stroke="#8c6e52" strokeWidth="2" />
        {/* Luggage Tag Body */}
        <polygon points="50,60 110,60 120,75 120,145 40,145 40,75" fill="#d9c9ba" stroke="#6e4f32" strokeWidth="2" />
        {/* Stitched perimeter */}
        <polygon points="53,65 107,65 115,77 115,140 45,140 45,77" stroke="#bba591" strokeWidth="1.2" strokeDasharray="3 2" fill="#faf6f0" />
        {/* ID window lines */}
        <line x1="55" y1="92" x2="105" y2="92" stroke="#bba591" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="55" y1="104" x2="95" y2="104" stroke="#bba591" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="55" y1="116" x2="85" y2="116" stroke="#bba591" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Small delicate lock charm over tag */}
      <div className="absolute bottom-8 right-16 bg-[#f7f2ec] border-2 border-[#6e4f32] rounded-xl p-2.5 shadow-md">
        <svg className="w-6 h-6 text-[#6e4f32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Sticky Note */}
      <div className="absolute top-10 left-6 rotate-[-8deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md">
        <p className="font-script text-[#6e4f32] text-sm leading-none">safe & sound</p>
      </div>
    </div>
  );
}

/**
 * 06 · Trip Not Available: Empty polaroid frame on corkboard with single brass pushpin
 */
export function PolaroidCorkboardIllustration({ className = "" }: IllustrationProps) {
  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Corkboard texture block */}
      <div className="absolute w-60 h-44 bg-[#e7ded4] rounded-2xl border border-[#bba591]/40 shadow-inner flex items-center justify-center">
        <div className="w-full h-full opacity-20 bg-[radial-gradient(#8c6e52_1px,transparent_1px)] [background-size:12px_12px]"></div>
      </div>

      {/* Single Brass Pushpin at top center */}
      <div className="absolute top-2 z-20 flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-[#8c6e52] border border-[#6e4f32] shadow-sm"></div>
        <div className="w-1 h-2 bg-[#6e4f32]"></div>
      </div>

      {/* Empty Polaroid Frame pinned, rotated slightly */}
      <div className="relative z-10 w-36 h-44 bg-white border border-[#bba591]/50 rounded-lg shadow-md rotate-[-4deg] p-3 flex flex-col justify-between">
        {/* Empty cutout with soft taupe dashed border */}
        <div className="w-full h-28 bg-[#f7f2ec] border border-dashed border-[#bba591] rounded-sm flex items-center justify-center">
          <svg className="w-8 h-8 text-[#bba591]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        {/* Empty handwriting line */}
        <div className="w-16 h-1.5 bg-[#d9c9ba]/60 mx-auto rounded-full"></div>
      </div>

      {/* Sticky Note on board edge */}
      <div className="absolute bottom-2 right-4 rotate-[7deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md z-20">
        <p className="font-script text-[#6e4f32] text-sm leading-none">private journey</p>
      </div>
    </div>
  );
}

/**
 * 07 · Limit Reached: Hourglass beside stack of vintage boarding tickets
 */
export function HourglassTicketsIllustration({ className = "" }: IllustrationProps) {
  return (
    <div className={`relative w-72 h-56 flex items-center justify-center ${className}`}>
      {/* Stack of vintage boarding tickets */}
      <div className="absolute left-8 bottom-6 flex flex-col gap-1.5 rotate-[-8deg]">
        {/* Ticket 1 */}
        <div className="w-32 h-12 bg-white border border-[#bba591] rounded-lg shadow-sm px-2.5 py-1.5 flex items-center justify-between border-dashed">
          <span className="font-mono text-[9px] text-[#8c6e52] font-semibold">TICKET · 01</span>
          <span className="text-[9px] text-[#a28973]">ROMA</span>
        </div>
        {/* Ticket 2 */}
        <div className="w-32 h-12 bg-[#d9c9ba]/30 border border-[#bba591] rounded-lg shadow-sm px-2.5 py-1.5 flex items-center justify-between border-dashed">
          <span className="font-mono text-[9px] text-[#8c6e52] font-semibold">TICKET · 02</span>
          <span className="text-[9px] text-[#a28973]">KYOTO</span>
        </div>
      </div>

      {/* Hourglass sitting beside tickets */}
      <div className="relative z-10 ml-16">
        <svg className="w-24 h-36 filter drop-shadow-sm" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Wooden top and bottom plates */}
          <rect x="15" y="10" width="70" height="8" rx="3" fill="#6e4f32" />
          <rect x="15" y="132" width="70" height="8" rx="3" fill="#6e4f32" />
          <line x1="22" y1="18" x2="22" y2="132" stroke="#8c6e52" strokeWidth="2.5" />
          <line x1="78" y1="18" x2="78" y2="132" stroke="#8c6e52" strokeWidth="2.5" />
          {/* Glass bulbs */}
          <path d="M28 20 C28 65 46 72 49 75 C46 78 28 85 28 130 H72 C72 85 54 78 51 75 C54 72 72 65 72 20 Z" fill="#faf6f0" stroke="#bba591" strokeWidth="1.8" />
          {/* Upper Sand Pool */}
          <path d="M34 45 Q50 55 66 45 L68 28 H32 Z" fill="#d9c9ba" />
          {/* Falling sand trickling */}
          <line x1="50" y1="72" x2="50" y2="115" stroke="#a28973" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Lower Sand Mound */}
          <path d="M34 126 C42 112 58 112 66 126 Z" fill="#d9c9ba" />
        </svg>
      </div>

      {/* Sticky Note */}
      <div className="absolute -bottom-1 -left-1 rotate-[-4deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md z-20">
        <p className="font-script text-[#6e4f32] text-sm leading-none">take a breath ☕</p>
      </div>
    </div>
  );
}
