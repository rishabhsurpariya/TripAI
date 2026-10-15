"use client";

import Image from "next/image";
import { useState } from "react";
import {
  GripVertical,
  Clock,
  DollarSign,
  Trash2,
  RefreshCw,
  Plus,
  Minus,
  MessageSquarePlus,
  MapPin,
} from "lucide-react";
import { Activity } from "@/types/trip";
import { StickyNote } from "./StickyNote";

export interface ActivityCardProps {
  activity: Activity;
  index?: number;
  isEditMode?: boolean;
  onDelete?: (id: string) => void;
  onReplace?: (id: string) => void;
  onUpdateDuration?: (id: string, newMinutes: number) => void;
  onUpdateCost?: (id: string, newCost: number) => void;
  onUpdateNote?: (id: string, newNote: string) => void;
}

export function ActivityCard({
  activity,
  index = 1,
  isEditMode = false,
  onDelete,
  onReplace,
  onUpdateDuration,
  onUpdateCost,
  onUpdateNote,
}: ActivityCardProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [costValue, setCostValue] = useState(activity.estimatedCost);

  const durationHours = (activity.durationMinutes / 60).toFixed(1);

  const handleDurationDelta = (deltaHours: number) => {
    const newMinutes = Math.max(30, activity.durationMinutes + deltaHours * 60);
    if (onUpdateDuration) onUpdateDuration(activity.id, newMinutes);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
    setCostValue(num);
    if (onUpdateCost) onUpdateCost(activity.id, num);
  };

  return (
    <div className="relative flex flex-col group/card my-4">
      {/* Timeline Circle Number */}
      <div className="absolute -left-4 sm:-left-6 top-6 w-8 h-8 rounded-full bg-[#fef9f2] border-2 border-[#6e4f32] flex items-center justify-center font-serif text-xs font-bold text-[#6e4f32] shadow-xs z-10">
        {index}
      </div>

      {/* Card Container */}
      <div className="ml-6 sm:ml-8 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#d3c4b9]/50 hover:border-[#6e4f32]/60 transition-all relative">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#d3c4b9]/30">
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#75593e]">
            {isEditMode && (
              <div
                className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-[#81756b] hover:text-[#1d1b18] rounded hover:bg-[#f2ede7] flex items-center"
                title="Drag to reorder stop"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8f3ed] font-medium text-[#54381d]">
              <Clock className="w-3.5 h-3.5 text-[#81756b]" />
              <span className="capitalize">{activity.timeSlot}</span>
            </div>

            <span className="text-[#d3c4b9]">&bull;</span>

            {/* Duration Display or Stepper */}
            {isEditMode ? (
              <div className="inline-flex items-center rounded-full bg-[#f8f3ed] border border-[#d3c4b9]/50 px-2 py-0.5 text-xs text-[#54381d]">
                <button
                  type="button"
                  onClick={() => handleDurationDelta(-0.5)}
                  className="w-4 h-4 rounded-full hover:bg-white flex items-center justify-center text-[#75593e]"
                  title="Decrease duration"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 font-semibold">{durationHours}h</span>
                <button
                  type="button"
                  onClick={() => handleDurationDelta(0.5)}
                  className="w-4 h-4 rounded-full hover:bg-white flex items-center justify-center text-[#75593e]"
                  title="Increase duration"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="font-medium text-[#75593e]">{durationHours} Hours</span>
            )}
          </div>

          {/* Category Pill & Edit Actions */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-[#f2ede7] text-[#54381d] text-xs font-medium">
              {activity.category}
            </span>

            {isEditMode && (
              <div className="flex items-center gap-1 border-l border-[#d3c4b9]/40 pl-2">
                {onReplace && (
                  <button
                    type="button"
                    onClick={() => onReplace(activity.id)}
                    className="p-1.5 text-[#75593e] hover:text-[#54381d] rounded-full hover:bg-[#f8f3ed]"
                    title="Replace with alternative stop"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(activity.id)}
                    className="p-1.5 text-[#75593e] hover:text-[#ba1a1a] rounded-full hover:bg-[#ffdad6]/40"
                    title="Remove stop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content: Photo + Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <div className="md:col-span-5 h-44 sm:h-48 rounded-xl overflow-hidden relative bg-[#f2ede7]">
            <Image
              src={activity.imageUrl || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"}
              alt={activity.name}
              fill
              className="object-cover group-hover/card:scale-105 transition-transform duration-500"
              unoptimized
            />
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-[#54381d] flex items-center gap-1 shadow-xs">
              <MapPin className="w-3 h-3 text-[#6e4f32]" />
              <span>{activity.category}</span>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#54381d] tracking-tight">
                {activity.name}
              </h3>
              <p className="text-sm text-[#4f453c] mt-2 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Bottom Meta & Sticky Note Button */}
            <div className="pt-3 border-t border-[#d3c4b9]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-[#54381d]">
                <DollarSign className="w-3.5 h-3.5 text-[#6e4f32]" />
                <span className="text-[#81756b]">Est. Cost:</span>
                {isEditMode ? (
                  <input
                    type="number"
                    value={costValue}
                    onChange={handleCostChange}
                    className="w-20 px-2 py-0.5 bg-[#f8f3ed] rounded-lg border border-[#d3c4b9] font-semibold text-[#54381d] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                  />
                ) : (
                  <span className="font-semibold">
                    {activity.estimatedCost > 0 ? `$${activity.estimatedCost}` : "Free Entry"}
                  </span>
                )}
              </div>

              {!activity.note && !showAddNote && isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowAddNote(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#75593e] hover:text-[#54381d]"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Attach memo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Attached Sticky Note */}
        {(activity.note || showAddNote) && (
          <div className="mt-5 pt-3">
            <StickyNote
              note={activity.note || "Add special reminder or timing tip here..."}
              title="Activity Note"
              defaultColor={activity.noteColor || "#fdfbf7"}
              isEditable={isEditMode}
              onUpdateNote={(newNote) => {
                if (onUpdateNote) onUpdateNote(activity.id, newNote);
              }}
              onDelete={() => {
                setShowAddNote(false);
                if (onUpdateNote) onUpdateNote(activity.id, "");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
