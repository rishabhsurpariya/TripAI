"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: "right" | "bottom";
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  className = "",
}: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#1d1b18]/40 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-300" />
        <DialogPrimitive.Content
          className={`fixed z-50 bg-[#fef9f2] shadow-2xl border-[#d3c4b9]/70 focus:outline-none flex flex-col justify-between transition-transform duration-300 ${
            side === "right"
              ? "inset-y-0 right-0 w-full max-w-md border-l animate-in slide-in-from-right"
              : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t animate-in slide-in-from-bottom"
          } ${className}`}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-[#d3c4b9]/40 flex items-start justify-between gap-4">
            <div>
              {title && (
                <DialogPrimitive.Title className="font-serif text-xl sm:text-2xl font-bold text-[#54381d]">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-xs text-[#81756b] mt-1">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="w-8 h-8 rounded-full hover:bg-[#f2ede7] flex items-center justify-center text-[#75593e] transition-colors focus:outline-none">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 sm:p-5 border-t border-[#d3c4b9]/40 bg-[#f8f3ed] flex justify-end gap-3">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
