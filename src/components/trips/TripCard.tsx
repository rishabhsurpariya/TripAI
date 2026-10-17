"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Users,
  Share2,
  MoreVertical,
  ArrowRight,
  Copy,
  Trash2,
  Edit2,
  Check,
  X,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trip } from "@/types/trip";

export interface TripCardProps {
  trip: Trip;
  variant?: "grid" | "list";
  status?: "upcoming" | "past" | "draft";
  isEditing?: boolean;
  onShare?: (trip: Trip) => void;
  onDuplicate?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
  onRename?: (trip: Trip) => void;
  onSaveRename?: (id: string, newTitle: string) => void;
  onCancelRename?: () => void;
}

export function TripCard({
  trip,
  variant = "grid",
  status = "upcoming",
  isEditing = false,
  onShare,
  onDuplicate,
  onDelete,
  onRename,
  onSaveRename,
  onCancelRename,
}: TripCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editTitleInput, setEditTitleInput] = useState(trip.destination);
  const menuRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setEditTitleInput(trip.destination);
  }, [trip.destination]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalSpent =
    (trip.budget?.transport || 0) +
    (trip.budget?.stay || 0) +
    (trip.budget?.food || 0) +
    (trip.budget?.activities || 0) +
    (trip.budget?.misc || 0);

  const budgetRatio = trip.totalBudget > 0 ? Math.min(100, Math.round((totalSpent / trip.totalBudget) * 100)) : 100;

  // Format currency
  const formatCost = (amt: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const dayCount = trip.days?.length || 5;

  if (variant === "list") {
    return (
      <article className="group bg-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#d3c4b9]/50 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#f2ede7]">
            <Image
              src={trip.coverImageUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"}
              alt={trip.destination}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div
                className="flex items-center gap-1.5 my-1"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={editTitleInput}
                  onChange={(e) => setEditTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editTitleInput.trim()) {
                      onSaveRename?.(trip.id, editTitleInput.trim());
                    }
                    if (e.key === "Escape") {
                      onCancelRename?.();
                    }
                  }}
                  autoFocus
                  className="w-full px-2.5 py-1 text-sm font-serif font-bold text-[#54381d] bg-[#f8f3ed] rounded-lg border border-[#6e4f32] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                  placeholder="Trip destination..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (editTitleInput.trim()) {
                      onSaveRename?.(trip.id, editTitleInput.trim());
                    }
                  }}
                  className="p-1.5 rounded-md bg-[#6e4f32] text-white hover:bg-[#54381d] cursor-pointer"
                  title="Save"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onCancelRename?.()}
                  className="p-1.5 rounded-md bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc] cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-lg font-bold text-[#54381d] truncate">
                  {trip.destination}, {trip.country}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6e4f32] text-white text-[10px] font-semibold uppercase tracking-wider">
                  {status}
                </span>
                {trip.isShared && (
                  <span className="px-2 py-0.5 rounded-full bg-[#f2ede7] text-[#54381d] text-[10px] font-medium flex items-center gap-1">
                    <LinkIcon className="w-2.5 h-2.5" /> Shared
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-[#81756b] mt-1 flex items-center gap-2 flex-wrap">
              <span>{dayCount} Days</span>
              <span>&bull;</span>
              <span>{trip.travelers} Travelers</span>
              <span>&bull;</span>
              <span className="font-semibold text-[#54381d]">{formatCost(trip.totalBudget)}</span>
              <span>&bull;</span>
              <span className="capitalize text-[#75593e]">{trip.style} style</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#d3c4b9]/30">
          <span className="text-[11px] text-[#81756b]">Active draft</span>
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                type="button"
                onClick={() => onShare(trip)}
                className="p-2 rounded-full text-[#75593e] hover:bg-[#f8f3ed] hover:text-[#54381d] transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full text-[#75593e] hover:bg-[#f8f3ed] hover:text-[#54381d] transition-colors"
                title="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 6 }}
                    transition={{ duration: shouldReduceMotion ? 0.05 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 bottom-full md:bottom-auto md:top-full mb-1.5 md:mb-0 md:mt-1.5 w-48 py-1.5 bg-white rounded-2xl border border-[#d3c4b9]/60 shadow-[0_10px_30px_-10px_rgba(110,79,50,0.12)] z-30 text-xs origin-top-right"
                  >
                    <Link
                      href={`/trip/${trip.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed]"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#81756b]" />
                      <span>View itinerary</span>
                    </Link>
                    {onShare && (
                      <button
                        type="button"
                        onClick={() => {
                          onShare(trip);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed] text-left"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#81756b]" />
                        <span>Share link</span>
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        type="button"
                        onClick={() => {
                          onDuplicate(trip);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed] text-left"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#81756b]" />
                        <span>Duplicate trip</span>
                      </button>
                    )}
                    {onRename && (
                      <button
                        type="button"
                        onClick={() => {
                          onRename(trip);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed] text-left"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#81756b]" />
                        <span>Rename title</span>
                      </button>
                    )}
                    <div className="my-1 border-t border-[#d3c4b9]/30"></div>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(trip);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/30 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete trip</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href={`/trip/${trip.id}`}
              className="px-4 py-2 rounded-full bg-[#f8f3ed] hover:bg-[#6e4f32] text-[#54381d] hover:text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
            >
              <span>Open trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#d3c4b9]/50 shadow-sm hover:shadow-md transition-shadow">
      <div>
        {/* Photo & Badges */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#f2ede7] mb-4">
          <Image
            src={trip.coverImageUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"}
            alt={trip.destination}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-[#6e4f32] text-white text-[11px] font-semibold shadow-xs">
              {status === "upcoming" ? "Upcoming" : status === "past" ? "Past" : "Draft"}
            </span>
            {trip.isShared && (
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#54381d] text-[11px] font-medium flex items-center gap-1 shadow-xs">
                <LinkIcon className="w-3 h-3" />
                <span>Shared</span>
              </span>
            )}
          </div>

          {/* Context Action Menu */}
          <div className="absolute top-3 right-3" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#54381d] flex items-center justify-center hover:bg-white shadow-xs transition-colors"
              aria-label="Trip actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-1.5 w-48 py-1.5 bg-white rounded-2xl border border-[#d3c4b9]/60 shadow-[0_10px_30px_-10px_rgba(110,79,50,0.12)] z-30 text-xs origin-top-right"
                >
                  <Link
                    href={`/trip/${trip.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#81756b]" />
                    <span>View itinerary</span>
                  </Link>
                  {onShare && (
                    <button
                      type="button"
                      onClick={() => {
                        onShare(trip);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed] text-left"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#81756b]" />
                      <span>Share link</span>
                    </button>
                  )}
                  {onDuplicate && (
                    <button
                      type="button"
                      onClick={() => {
                        onDuplicate(trip);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed] text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#81756b]" />
                      <span>Duplicate trip</span>
                    </button>
                  )}
                  {onRename && (
                    <button
                      type="button"
                      onClick={() => {
                        onRename(trip);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#54381d] hover:bg-[#f8f3ed] text-left"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#81756b]" />
                      <span>Rename title</span>
                    </button>
                  )}
                  <div className="my-1 border-t border-[#d3c4b9]/30"></div>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(trip);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/30 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete trip</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title & Duration (supports inline rename) */}
        {isEditing ? (
          <div
            className="flex items-center gap-1.5 my-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editTitleInput}
              onChange={(e) => setEditTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editTitleInput.trim()) {
                  onSaveRename?.(trip.id, editTitleInput.trim());
                }
                if (e.key === "Escape") {
                  onCancelRename?.();
                }
              }}
              autoFocus
              className="w-full px-2.5 py-1 text-sm font-serif font-bold text-[#54381d] bg-[#f8f3ed] rounded-lg border border-[#6e4f32] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
              placeholder="Trip destination..."
            />
            <button
              type="button"
              onClick={() => {
                if (editTitleInput.trim()) {
                  onSaveRename?.(trip.id, editTitleInput.trim());
                }
              }}
              className="p-1.5 rounded-md bg-[#6e4f32] text-white hover:bg-[#54381d] cursor-pointer"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onCancelRename?.()}
              className="p-1.5 rounded-md bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc] cursor-pointer"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <h2 className="font-serif text-xl font-bold text-[#54381d] tracking-tight flex items-center justify-between group/title">
            <span>
              {trip.destination} &bull; {trip.country}
            </span>
            {onRename && (
              <button
                type="button"
                onClick={() => onRename(trip)}
                className="opacity-0 group-hover/title:opacity-100 p-1 rounded hover:bg-[#f2ede7] text-[#81756b] hover:text-[#54381d] transition-opacity cursor-pointer"
                title="Rename trip"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </h2>
        )}
        <p className="text-xs text-[#81756b] mt-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#81756b]" />
          <span>{dayCount} Days Itinerary</span>
        </p>

        {/* Meta Info */}
        <div className="mt-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#75593e]">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#81756b]" /> {trip.travelers} Travelers
          </span>
          <span className="text-[#d3c4b9]">&bull;</span>
          <span className="font-semibold text-[#54381d]">{formatCost(trip.totalBudget)}</span>
          <span className="text-[#d3c4b9]">&bull;</span>
          <span className="capitalize">{trip.style}</span>
        </div>

        {/* Budget Allocation Progress Bar */}
        <div className="mt-3">
          <div className="w-full h-1.5 rounded-full bg-[#f2ede7] overflow-hidden">
            <div
              className="h-full bg-[#75593e] rounded-full transition-all duration-300"
              style={{ width: `${budgetRatio}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[11px]">
            <span className="text-[#81756b]">{budgetRatio}% allocated</span>
            <span className="text-[#75593e] font-medium">
              {formatCost(totalSpent)} spent
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 flex items-center justify-between border-t border-[#d3c4b9]/30">
        <span className="text-[11px] text-[#81756b]">Curated AI Plan</span>
        <Link
          href={`/trip/${trip.id}`}
          className="text-xs font-semibold text-[#6e4f32] hover:text-[#54381d] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Open trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
