"use client";

import { useState } from "react";
import { Sparkles, Pin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { easing } from "@/lib/motion";

export interface StickyNoteProps {
  note: string;
  title?: string;
  defaultColor?: string;
  isAiNote?: boolean;
  isEditable?: boolean;
  onUpdateNote?: (newText: string) => void;
  onDelete?: () => void;
  className?: string;
  initialRotate?: number;
}

export function StickyNote({
  note,
  title = "Traveler's Memo",
  defaultColor = "#fdfbf7",
  isAiNote = false,
  className = "",
  initialRotate = -1.5,
}: StickyNoteProps) {
  const [currentColor] = useState(defaultColor);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { rotate: initialRotate, y: 12, opacity: 0 }}
      whileInView={{ rotate: initialRotate, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: easing }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              rotate: initialRotate * 0.15, // straighten significantly on hover
              scale: 1.03,
              transition: { duration: 0.22, ease: easing },
            }
      }
      className={`relative p-3.5 sm:p-4 rounded-md shadow-md border transition-shadow duration-300 ${className}`}
      style={{ backgroundColor: currentColor, borderColor: "#bba59135" }}
    >
      {/* Washi Tape Strip on Top */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-[#bba591]/50 rounded-xs backdrop-blur-sm -rotate-1 shadow-xs pointer-events-none" />

      {/* Header with Title */}
      <div className="flex items-center justify-between mb-1.5 gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[#75593e] text-[10px] flex items-center gap-1">
          {isAiNote ? (
            <>
              <Sparkles className="w-3 h-3 text-[#e9bf9a]" />
              <span>AI Discovery</span>
            </>
          ) : (
            <span>{title}</span>
          )}
        </span>
        <Pin className="w-3.5 h-3.5 text-[#81756b]" />
      </div>

      {/* Note Body in Caveat Script Font */}
      <p className="font-handwriting text-base sm:text-lg leading-snug text-[#4d3a28]">
        &ldquo;{note}&rdquo;
      </p>
    </motion.div>
  );
}
