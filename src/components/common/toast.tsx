"use client";

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#54381d] text-white shadow-2xl border border-[#ffd9b7]/30 text-xs sm:text-sm font-medium",
        },
      }}
    />
  );
}

export const toast = {
  success: (message: string) => {
    sonnerToast.custom((id) => (
      <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#54381d] text-white shadow-2xl border border-[#ffd9b7]/30 text-xs sm:text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-[#ffd9b7] shrink-0" />
        <span>{message}</span>
      </div>
    ));
  },
  error: (message: string) => {
    sonnerToast.custom((id) => (
      <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#ba1a1a] text-white shadow-2xl border border-white/20 text-xs sm:text-sm font-medium">
        <AlertCircle className="w-4 h-4 text-white shrink-0" />
        <span>{message}</span>
      </div>
    ));
  },
  info: (message: string) => {
    sonnerToast.custom((id) => (
      <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#6e4f32] text-white shadow-2xl border border-[#ffd9b7]/30 text-xs sm:text-sm font-medium">
        <Info className="w-4 h-4 text-[#ffd9b7] shrink-0" />
        <span>{message}</span>
      </div>
    ));
  },
};
