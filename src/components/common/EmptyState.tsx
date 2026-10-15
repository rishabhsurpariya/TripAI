import * as React from "react";
import { Compass, Sparkles } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-3xl p-8 sm:p-12 bg-[#f8f3ed] border border-[#d3c4b9]/50 flex flex-col items-center justify-center text-center transition-all ${className}`}
    >
      {/* Icon Capsule */}
      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#d3c4b9]/40 flex items-center justify-center text-[#54381d] mb-4 transition-transform hover:scale-105">
        {icon || <Compass className="w-8 h-8 text-[#6e4f32]" />}
      </div>

      {/* Title & Description */}
      <h3 className="font-serif text-2xl font-bold text-[#54381d]">
        {title}
      </h3>
      <p className="text-sm text-[#4f453c] max-w-md mt-2 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 justify-center">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-6 py-3 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#ffd9b7]" />
            <span>{actionLabel}</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-5 py-3 rounded-full bg-white border border-[#d3c4b9] text-[#54381d] hover:bg-[#f2ede7] text-xs sm:text-sm font-medium transition-all"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
