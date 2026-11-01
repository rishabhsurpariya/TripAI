"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import { Trip, TransportOption } from "@/types/trip";
import { AffiliateCategory } from "@/config/affiliates";
import { buildBookingLink, getPartnersForCategory } from "@/lib/booking";

interface BookingButtonProps {
  category: AffiliateCategory;
  label: "Find tickets" | "Check availability";
  trip: Trip;
  dayNumber?: number;
  hotelName?: string;
  transportMode?: TransportOption["mode"];
  isEditMode?: boolean;
  className?: string;
}

export function BookingButton({
  category,
  label,
  trip,
  dayNumber,
  hotelName,
  transportMode,
  isEditMode = false,
  className = "",
}: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Never render booking buttons in edit mode
  if (isEditMode) return null;

  // Retrieve partners for category
  const partners = getPartnersForCategory(category);
  const partnerLinks = partners
    .map((partner) => {
      const url = buildBookingLink({
        partnerId: partner.id,
        trip,
        dayNumber,
        hotelName,
        transportMode,
      });
      return { partner, url };
    })
    .filter((item): item is { partner: (typeof partners)[0]; url: string } => item.url !== null);

  if (partnerLinks.length === 0) return null;

  const primary = partnerLinks[0];

  // If only 1 partner, render a direct single link button
  if (partnerLinks.length === 1) {
    return (
      <a
        href={primary.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-secondary text-primary hover:bg-surface-container-high text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 ${className}`}
        title={`${label} on ${primary.partner.name}`}
      >
        <span>{label}</span>
        <ExternalLink className="w-3 h-3 opacity-60" />
      </a>
    );
  }

  // If multiple partners, render a split button with dropdown menu
  return (
    <div ref={menuRef} className={`relative inline-flex items-center ${className}`}>
      <div className="inline-flex items-center rounded-full border border-secondary bg-surface-container-low/50 shadow-2xs">
        <a
          href={primary.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-container-high rounded-l-full transition-colors cursor-pointer active:scale-95"
          title={`${label} on ${primary.partner.name}`}
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-2 py-2 border-l border-secondary/30 text-primary hover:bg-surface-container-high rounded-r-full transition-colors cursor-pointer"
          title="Choose booking partner"
          aria-label={`Select booking provider for ${label}`}
          aria-expanded={isOpen}
        >
          <ChevronDown
            className={`w-3 h-3 text-secondary transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-surface rounded-xl shadow-lg border border-outline-variant/60 py-1.5 z-50 text-xs">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary border-b border-outline-variant/30">
            Select Provider
          </div>
          {partnerLinks.map(({ partner, url }) => (
            <a
              key={partner.id}
              href={url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-on-surface hover:bg-surface-container-high transition-colors font-medium cursor-pointer"
            >
              <span>{partner.name}</span>
              <ExternalLink className="w-3 h-3 opacity-60 text-secondary" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Standard disclosure line for affiliate links.
 */
export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-[11px] text-on-surface-variant/70 italic ${className}`}
    >
      Some links may be affiliate links. We may earn a commission at no extra cost to you.
    </p>
  );
}

