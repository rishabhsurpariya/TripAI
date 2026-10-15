"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className = "",
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#1d1b18]/40 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200" />
        <DialogPrimitive.Content
          className={`fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-[#fef9f2] rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_-8px_rgba(110,79,50,0.18)] border border-[#d3c4b9]/70 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-200 ${className}`}
        >
          <div className="flex items-start justify-between gap-4 pb-3">
            <div>
              {title && (
                <DialogPrimitive.Title className="font-serif text-2xl font-bold text-[#54381d]">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-sm text-[#4f453c] mt-1 leading-relaxed">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="w-8 h-8 rounded-full hover:bg-[#f2ede7] flex items-center justify-center text-[#75593e] transition-colors focus:outline-none">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="py-3 text-sm text-[#1d1b18]">{children}</div>

          {footer && (
            <div className="pt-4 border-t border-[#d3c4b9]/40 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
