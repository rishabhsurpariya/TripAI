"use client";

import { motion, useReducedMotion } from "framer-motion";

interface PasswordStrengthProps {
  password?: string;
}

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  level: "empty" | "weak" | "okay" | "strong";
  label: string;
} {
  if (!password || password.length === 0) {
    return { score: 0, level: "empty", label: "" };
  }
  if (password.length < 6) {
    return { score: 1, level: "weak", label: "Weak" };
  }

  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let score = 2; // base okay for 6+ chars
  if (password.length >= 8 && (hasNumbers || hasSymbols)) {
    score = 3;
  }
  if (password.length >= 8 && (hasNumbers || hasSymbols) && (hasMixed || (hasNumbers && hasSymbols))) {
    score = 4;
  }

  if (score >= 3) {
    return { score, level: "strong", label: "Strong" };
  }
  return { score: 2, level: "okay", label: "Okay" };
}

export function PasswordStrengthIndicator({ password = "" }: PasswordStrengthProps) {
  const { score, label } = evaluatePasswordStrength(password);
  const prefersReduced = useReducedMotion();

  const segmentActive = (index: number) => score >= index;

  return (
    <div className="pt-2">
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((segIndex) => {
          const active = segmentActive(segIndex);
          return (
            <div
              key={segIndex}
              className="relative h-full rounded-full bg-surface-container-highest overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{
                  width: active ? "100%" : "0%",
                  backgroundColor: active
                    ? segIndex === 1 && score === 1
                      ? "#a28973"
                      : "#6e4f32"
                    : "#6e4f32",
                }}
                transition={{
                  duration: prefersReduced ? 0 : 0.35,
                  ease: "easeOut",
                }}
                className="h-full rounded-full"
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-body-sm text-[12px] text-secondary font-light">
          At least 8 characters with a number or symbol
        </span>
        {label && (
          <motion.span
            key={label}
            initial={prefersReduced ? false : { opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`font-label-sm text-[11px] font-semibold ${
              label === "Strong"
                ? "text-primary"
                : label === "Okay"
                ? "text-secondary"
                : "text-amber-800"
            }`}
          >
            {label}
          </motion.span>
        )}
      </div>
    </div>
  );
}
