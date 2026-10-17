"use client";

import React from "react";
import Link from "next/link";

export type ErrorNavType = "logged-out" | "logged-in" | "offline" | "session" | "minimal" | "none";

export interface ErrorLayoutProps {
  illustration: React.ReactNode;
  headline: React.ReactNode;
  caption: React.ReactNode;
  buttons: React.ReactNode;
  nav?: React.ReactNode;
  navType?: ErrorNavType;
  statusBadge?: string;
  fullScreen?: boolean;
  className?: string;
}

export function ErrorLayout({
  illustration,
  headline,
  caption,
  buttons,
  nav,
  navType = "logged-out",
  statusBadge,
  fullScreen = true,
  className = "",
}: ErrorLayoutProps) {
  // Render default nav based on navType if custom nav isn't provided
  const renderNav = () => {
    if (nav !== undefined) return nav;
    if (navType === "none") return null;

    return (
      <nav className="h-16 border-b border-[#bba591]/30 px-6 sm:px-8 flex items-center justify-between bg-[#f7f2ec]/90 backdrop-blur-sm">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[#6e4f32] hover:opacity-85 transition-opacity"
        >
          <svg
            className="w-5 h-5 text-[#6e4f32] anim-drift"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span className="font-serif text-xl font-medium tracking-tight text-[#6e4f32]">
            TripAi
          </span>
        </Link>

        {/* Nav actions depending on state */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          {statusBadge && (
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#a28973] bg-[#d9c9ba]/30 px-2.5 py-0.5 rounded-full border border-[#bba591]/30 hidden sm:inline-block">
              {statusBadge}
            </span>
          )}

          {navType === "logged-out" && (
            <>
              <Link
                href="/explore"
                className="text-[#a28973] hover:text-[#6e4f32] transition-colors hidden xs:inline"
              >
                Explore
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-[#6e4f32] text-white text-xs font-medium hover:bg-[#8c6e52] transition-all"
              >
                Sign in
              </Link>
            </>
          )}

          {navType === "logged-in" && (
            <>
              <Link
                href="/explore"
                className="text-[#a28973] hover:text-[#6e4f32] transition-colors hidden sm:inline"
              >
                Explore
              </Link>
              <Link
                href="/trips"
                className="text-[#a28973] hover:text-[#6e4f32] transition-colors hidden sm:inline"
              >
                My Trips
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#d9c9ba] border border-[#bba591]/60 flex items-center justify-center text-xs font-medium text-[#6e4f32]">
                CK
              </div>
            </>
          )}

          {navType === "offline" && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#d9c9ba]/30 text-[#8c6e52] border border-[#bba591]/30">
              Offline mode
            </span>
          )}

          {navType === "session" && (
            <Link
              href="/"
              className="text-xs font-medium text-[#8c6e52] hover:text-[#6e4f32] transition-colors"
            >
              Help
            </Link>
          )}

          {navType === "minimal" && (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-[#f7f2ec] text-[#6e4f32] border border-[#bba591]/40 text-xs font-medium hover:bg-[#d9c9ba]/40 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    );
  };

  const cardContent = (
    <div
      className={`screen-viewport w-full rounded-3xl overflow-hidden min-h-[580px] sm:min-h-[640px] flex flex-col justify-between ${className}`}
    >
      {/* Top Nav */}
      {renderNav()}

      {/* Centered Error Core */}
      <main className="max-w-[640px] w-full mx-auto px-6 py-10 sm:py-12 flex flex-col items-center text-center">
        {/* Illustration container */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center">
          {illustration}
        </div>

        {/* Headline: max 6 words */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#6e4f32] font-normal mb-3 tracking-tight">
          {headline}
        </h1>

        {/* Caption: max 10 words */}
        <p className="text-[#a28973] text-base mb-8 max-w-sm font-normal">
          {caption}
        </p>

        {/* Buttons: 16-24px radius, stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {buttons}
        </div>
      </main>

      {/* Bottom spacer for visual balance */}
      <div className="h-6" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-[#eee7df] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
        <div className="w-full max-w-[1280px] flex justify-center">
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
}

export default ErrorLayout;
