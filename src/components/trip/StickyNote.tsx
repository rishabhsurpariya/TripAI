"use client";

import { useState, useEffect } from "react";
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
  onUpdateColor?: (newColor: string) => void;
  onDelete?: () => void;
  className?: string;
  initialRotate?: number;
}

const PALETTE = [
  { label: "Pale Cream", color: "#fdfbf7" },
  { label: "Soft Sand", color: "#d9c9ba" },
  { label: "Light Taupe", color: "#bba591" },
  { label: "Warm Linen", color: "#ece3da" },
];

export function StickyNote({
  note,
  title = "Traveler's Memo",
  defaultColor = "#fdfbf7",
  isAiNote = false,
  isEditable = false,
  onUpdateNote,
  onUpdateColor,
  className = "",
  initialRotate = -1.5,
}: StickyNoteProps) {
  const [currentColor, setCurrentColor] = useState(defaultColor);
  const [text, setText] = useState(note);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setCurrentColor(defaultColor);
  }, [defaultColor]);

  useEffect(() => {
    setText(note);
  }, [note]);

  const handleColorChange = (c: string) => {
    setCurrentColor(c);
    onUpdateColor?.(c);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    onUpdateNote?.(val);
  };

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
              scale: 1.02,
              transition: { duration: 0.22, ease: easing },
            }
      }
      className={`relative p-3.5 sm:p-4 rounded-md shadow-md border transition-shadow duration-300 ${className}`}
      style={{ backgroundColor: currentColor, borderColor: "#bba59135" }}
    >
      {/* Washi Tape Strip on Top */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-[#bba591]/50 rounded-xs backdrop-blur-sm -rotate-1 shadow-xs pointer-events-none" />

      {/* Header with Title and Optional Color Palette Picker */}
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

        {isEditable ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] uppercase font-bold text-[#81756b]">Color:</span>
            {PALETTE.map((item) => (
              <button
                key={item.color}
                type="button"
                onClick={() => handleColorChange(item.color)}
                title={item.label}
                className={`w-3.5 h-3.5 rounded-full border border-[#bba591]/60 transition-transform cursor-pointer ${
                  currentColor === item.color
                    ? "ring-1.5 ring-[#6e4f32] scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: item.color }}
              />
            ))}
          </div>
        ) : (
          <Pin className="w-3.5 h-3.5 text-[#81756b]" />
        )}
      </div>

      {/* Note Body in Caveat Script Font */}
      {isEditable ? (
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Write your traveler's note here..."
          rows={3}
          className="font-handwriting text-base sm:text-lg leading-snug text-[#4d3a28] bg-transparent resize-none focus:outline-none w-full border-b border-[#bba591]/20 focus:border-[#6e4f32]"
        />
      ) : (
        <p className="font-handwriting text-base sm:text-lg leading-snug text-[#4d3a28]">
          &ldquo;{note}&rdquo;
        </p>
      )}
    </motion.div>
  );
}
