"use client";

import { useState } from "react";
import { Sparkles, X, Edit2, Check } from "lucide-react";

export interface StickyNoteProps {
  note: string;
  title?: string;
  defaultColor?: string;
  isAiNote?: boolean;
  isEditable?: boolean;
  onUpdateNote?: (newText: string) => void;
  onDelete?: () => void;
  className?: string;
}

const PALETTE = [
  { name: "Pale Cream", bg: "#fdfbf7", border: "#e8ded2" },
  { name: "Soft Sand", bg: "#d9c9ba", border: "#c2ae9d" },
  { name: "Sunlit Peach", bg: "#ffd9b7", border: "#eec39b" },
  { name: "Light Taupe", bg: "#bba591", border: "#a18c77" },
];

export function StickyNote({
  note,
  title = "Traveler's Memo",
  defaultColor = "#fdfbf7",
  isAiNote = false,
  isEditable = false,
  onUpdateNote,
  onDelete,
  className = "",
}: StickyNoteProps) {
  const [currentColor, setCurrentColor] = useState(defaultColor);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateNote) onUpdateNote(text);
  };

  return (
    <div
      className={`relative p-3.5 sm:p-4 rounded-xl shadow-md border transition-all duration-300 transform rotate-[-1.5deg] hover:rotate-0 hover:shadow-lg ${className}`}
      style={{ backgroundColor: currentColor, borderColor: "#bba59140" }}
    >
      {/* Washi Tape Strip on Top */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-[#bba591]/50 rounded-xs backdrop-blur-sm -rotate-2 shadow-xs pointer-events-none"></div>

      {/* Header with Title & Color Palette Dots */}
      <div className="flex items-center justify-between mb-2 gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[#75593e] text-[10px] flex items-center gap-1">
          {isAiNote ? (
            <>
              <Sparkles className="w-3 h-3 text-[#6e4f32]" />
              <span>AI Discovery</span>
            </>
          ) : (
            <span>{title}</span>
          )}
        </span>

        {/* Color Palette Switcher & Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            {PALETTE.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                onClick={() => setCurrentColor(c.bg)}
                className={`w-3 h-3 rounded-full border border-black/10 transition-transform ${
                  currentColor === c.bg ? "scale-125 ring-1 ring-[#54381d]" : "hover:scale-110"
                }`}
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>

          {isEditable && (
            <div className="flex items-center gap-1 ml-1 pl-1 border-l border-[#bba591]/40">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className="p-1 rounded hover:bg-black/5 text-[#54381d]"
                  title="Save note"
                >
                  <Check className="w-3 h-3" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded hover:bg-black/5 text-[#75593e]"
                  title="Edit note"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-1 rounded hover:bg-black/5 text-[#ba1a1a]"
                  title="Remove note"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note Body */}
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full text-sm leading-relaxed text-[#4d3a28] bg-transparent border-0 focus:outline-none resize-none font-serif italic"
          rows={3}
          autoFocus
        />
      ) : (
        <p className="text-sm leading-relaxed text-[#4d3a28] font-serif italic">
          &ldquo;{text}&rdquo;
        </p>
      )}
    </div>
  );
}
