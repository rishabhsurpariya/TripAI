"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#6e4f32] text-[#f5f0ea] mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-[#bba591]/25">
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#ffd9b7] text-[#54381d] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span
                className="text-2xl text-white tracking-tight font-semibold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                TripAi
              </span>
            </div>
            <p className="text-sm text-[#e2c5ad] italic">
              Bespoke travel intelligence
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-6 lg:gap-8 text-sm">
            <Link
              href="/privacy"
              className="text-[#e6e2dc]/80 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[#e6e2dc]/80 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-[#e6e2dc]/80 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#e6e2dc]/60">
            © 2025 TripAi Intelligence Ltd. All rights reserved.
          </p>
          <p className="text-[#dec1a9]/70">
            Crafted with atmospheric warmth &amp; AI precision
          </p>
        </div>
      </div>
    </footer>
  );
}
