"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

interface PublicNavbarProps {
  activePath?: string;
}

export function PublicNavbar({ activePath }: PublicNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#fef9f2]/95 backdrop-blur-md border-b border-[#bba591]/40 shadow-[0_12px_32px_-8px_rgba(110,79,50,0.12)]"
          : "bg-[#fef9f2]/80 backdrop-blur-xs border-b border-[#d3c4b9]/30 shadow-none"
      }`}
    >
      <div className="h-16 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#6e4f32] text-white flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:rotate-45">
            <Compass className="w-4 h-4 text-[#ffd9b7]" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#54381d]">
            TripAi
          </span>
        </Link>

        {/* Center / Right Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/explore"
              className={`transition-colors py-1.5 px-3 rounded-full ${
                activePath === "/explore"
                  ? "text-[#54381d] font-semibold bg-[#ffd9b7]/50"
                  : "text-[#4f453c] hover:text-[#1d1b18]"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="text-[#4f453c] hover:text-[#1d1b18] transition-colors py-1.5 px-3"
            >
              Log in
            </Link>
          </nav>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 font-medium text-xs sm:text-sm bg-[#6e4f32] text-white hover:bg-[#54381d] transition-all duration-200 rounded-full px-4 sm:px-5 py-2 shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffd9b7]" />
            <span>Get started</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
