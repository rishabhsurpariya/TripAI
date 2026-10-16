"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Banknote,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Users,
  PlaneTakeoff,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import { TRAVEL_STYLES } from "@/lib/constants";
import { fadeUp, staggerContainer, tapPress } from "@/lib/motion";
import type { TravelStyle } from "@/types/trip";

const plannerSchema = z.object({
  destination: z
    .string()
    .min(2, "Please enter a destination (e.g. Kyoto, Japan)"),
  budget: z
    .number()
    .min(100, "Minimum budget is $100"),
  days: z
    .number()
    .min(1, "Trip duration must be at least 1 day")
    .max(30, "Maximum trip duration is 30 days"),
  travelStyle: z.enum(["budget", "comfort", "adventure"]),
  groupSize: z.number().min(1).max(16),
  startingCity: z.string().optional(),
});

type PlannerFormData = z.infer<typeof plannerSchema>;

const QUICK_PROMPTS = [
  { label: "5 days in Tuscany", destination: "Tuscany, Italy", days: 5, budget: 2200 },
  { label: "Solo art tour in Paris", destination: "Paris, France", days: 4, budget: 1800 },
  { label: "Autumn foliage in Hokkaido", destination: "Hokkaido, Japan", days: 7, budget: 2900 },
];

export function TripPlannerForm() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlannerFormData>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      destination: "Kyoto, Japan",
      budget: 3200,
      days: 7,
      travelStyle: "comfort",
      groupSize: 2,
      startingCity: "San Francisco, SFO",
    },
  });

  const selectedStyle = watch("travelStyle");
  const travelerCount = watch("groupSize");

  const onSubmit = (data: PlannerFormData) => {
    const params = new URLSearchParams({
      destination: data.destination,
      budget: data.budget.toString(),
      days: data.days.toString(),
      style: data.travelStyle,
      travelers: data.groupSize.toString(),
      startCity: data.startingCity || "",
    });

    router.push(`/generating?${params.toString()}`);
  };

  const handleApplyPrompt = (prompt: (typeof QUICK_PROMPTS)[number]) => {
    setValue("destination", prompt.destination, { shouldValidate: true });
    setValue("days", prompt.days, { shouldValidate: true });
    setValue("budget", prompt.budget, { shouldValidate: true });
  };

  const containerVariants = staggerContainer(0.12, 0);

  return (
    <motion.section
      variants={prefersReduced ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      className="pt-8 pb-12"
    >
      {/* Header — Fade up on load */}
      <motion.div variants={prefersReduced ? undefined : fadeUp} className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd9b7]/50 text-[#54381d] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#6e4f32]" />
          <span>Intelligent bespoke journey architect</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl text-primary font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Where to next?
        </h1>
        <p className="text-secondary text-base sm:text-lg mt-3 leading-relaxed">
          Tell us your plans, and TripAi builds the perfect itinerary tailored to your cadence and curiosities.
        </p>
      </motion.div>

      {/* Floating Hero Card Form — Staggered fade up on load */}
      <motion.div
        variants={prefersReduced ? undefined : fadeUp}
        className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 mt-8 shadow-sm border border-[#d3c4b9]/40 transition-shadow duration-300 hover:shadow-md"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1: Primary Inputs (Destination, Budget, Days) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Destination */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="destination"
                className="text-xs font-semibold text-on-surface-variant flex items-center justify-between"
              >
                <span>Destination *</span>
                <span className="text-secondary text-[11px] font-normal">City or region</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-secondary pointer-events-none" />
                <input
                  id="destination"
                  type="text"
                  placeholder="Kyoto, Japan or Amalfi Coast..."
                  {...register("destination")}
                  className={`w-full h-12 pl-10 pr-4 bg-surface-container-low rounded-xl text-primary text-sm placeholder:text-[#a28973]/70 focus:bg-white focus:outline-none focus:ring-2 focus:shadow-[0_0_16px_rgba(110,79,50,0.18)] transition-all duration-200 ${
                    errors.destination
                      ? "ring-2 ring-[#ba1a1a] bg-[#ffdad6]/20"
                      : "focus:ring-[#6e4f32]/25 focus:border-[#6e4f32]"
                  }`}
                />
              </div>
              {errors.destination && (
                <span className="text-[11px] text-[#ba1a1a] mt-0.5 font-medium">
                  {errors.destination.message}
                </span>
              )}
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="budget"
                className="text-xs font-semibold text-on-surface-variant flex items-center justify-between"
              >
                <span>Budget (USD) *</span>
                <span className="text-secondary text-[11px] font-normal">Total approx</span>
              </label>
              <div className="relative flex items-center">
                <Banknote className="absolute left-3.5 w-4 h-4 text-secondary pointer-events-none" />
                <input
                  id="budget"
                  type="number"
                  placeholder="e.g. 3000"
                  step="50"
                  {...register("budget", { valueAsNumber: true })}
                  className={`w-full h-12 pl-10 pr-4 bg-surface-container-low rounded-xl text-primary text-sm placeholder:text-[#a28973]/70 focus:bg-white focus:outline-none focus:ring-2 focus:shadow-[0_0_16px_rgba(110,79,50,0.18)] transition-all duration-200 ${
                    errors.budget
                      ? "ring-2 ring-[#ba1a1a] bg-[#ffdad6]/20"
                      : "focus:ring-[#6e4f32]/25 focus:border-[#6e4f32]"
                  }`}
                />
              </div>
              {errors.budget && (
                <span className="text-[11px] text-[#ba1a1a] mt-0.5 font-medium">
                  {errors.budget.message}
                </span>
              )}
            </div>

            {/* Duration / Days */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="days"
                className="text-xs font-semibold text-on-surface-variant flex items-center justify-between"
              >
                <span>Duration (Days) *</span>
                <span className="text-secondary text-[11px] font-normal">1 to 30 days</span>
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 w-4 h-4 text-secondary pointer-events-none" />
                <input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="7"
                  {...register("days", { valueAsNumber: true })}
                  className={`w-full h-12 pl-10 pr-4 bg-surface-container-low rounded-xl text-primary text-sm placeholder:text-[#a28973]/70 focus:bg-white focus:outline-none focus:ring-2 focus:shadow-[0_0_16px_rgba(110,79,50,0.18)] transition-all duration-200 ${
                    errors.days
                      ? "ring-2 ring-[#ba1a1a] bg-[#ffdad6]/20"
                      : "focus:ring-[#6e4f32]/25 focus:border-[#6e4f32]"
                  }`}
                />
              </div>
              {errors.days && (
                <span className="text-[11px] text-[#ba1a1a] mt-0.5 font-medium">
                  {errors.days.message}
                </span>
              )}
            </div>
          </div>

          {/* Toggle for More options */}
          <div className="mt-5 pt-3">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#6e4f32] hover:text-[#54381d] transition-colors py-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showMoreOptions ? "Fewer options" : "More options (style, group, departure)"}</span>
              {showMoreOptions ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Expandable Options with smooth animated height */}
          <AnimatePresence initial={false}>
            {showMoreOptions && (
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-5 bg-surface-container-low/70 rounded-xl p-5 border border-[#d3c4b9]/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <SlidersHorizontal className="w-4 h-4 text-secondary" />
                      <span>Trip Customization &amp; Preferences</span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
                      Optional parameters
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Travel Style */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Travel Pace &amp; Style
                      </span>
                      <div className="flex items-center gap-2">
                        {TRAVEL_STYLES.map((style) => {
                          const isActive = selectedStyle === style.id;
                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => setValue("travelStyle", style.id as TravelStyle)}
                              className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer capitalize ${
                                isActive
                                  ? "bg-primary text-white shadow-xs"
                                  : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant"
                              }`}
                            >
                              {style.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Group Size Stepper */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Group Size
                      </span>
                      <div className="flex items-center justify-between h-12 bg-white rounded-xl px-4 border border-[#d3c4b9]/40 shadow-2xs">
                        <div className="flex items-center gap-2 text-primary text-sm">
                          <Users className="w-4 h-4 text-secondary" />
                          <span className="font-medium">
                            {travelerCount} {travelerCount === 1 ? "Traveler" : "Travelers"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setValue("groupSize", Math.max(1, travelerCount - 1))}
                            disabled={travelerCount <= 1}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-container-high text-primary hover:bg-surface-variant active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                            aria-label="Decrease travelers"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setValue("groupSize", Math.min(16, travelerCount + 1))}
                            disabled={travelerCount >= 16}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-container-high text-primary hover:bg-surface-variant active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                            aria-label="Increase travelers"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Starting City Input */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Starting Departure City
                      </span>
                      <div className="relative flex items-center">
                        <PlaneTakeoff className="absolute left-3.5 w-4 h-4 text-secondary pointer-events-none" />
                        <input
                          type="text"
                          placeholder="e.g. San Francisco, SFO"
                          {...register("startingCity")}
                          className="w-full h-12 pl-10 pr-4 bg-white rounded-xl text-primary text-sm border border-[#d3c4b9]/40 placeholder:text-[#a28973]/70 focus:outline-none focus:ring-2 focus:ring-[#6e4f32]/25 focus:border-[#6e4f32] focus:shadow-[0_0_16px_rgba(110,79,50,0.18)] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row & Prompt Chips */}
          <div className="mt-7 pt-4 border-t border-[#d3c4b9]/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-secondary text-xs flex-wrap">
              <span className="font-semibold text-primary">Or try:</span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <span key={prompt.label} className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPrompt(prompt)}
                    className="hover:text-primary hover:underline transition-colors cursor-pointer"
                  >
                    {prompt.label}
                  </button>
                  {idx < QUICK_PROMPTS.length - 1 && (
                    <span className="text-[#bba591]">•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Generate Button with hover lift and tap press */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={
                prefersReduced
                  ? undefined
                  : { y: -2, boxShadow: "0 10px 24px -4px rgba(110,79,50,0.3)" }
              }
              whileTap={prefersReduced ? undefined : tapPress.whileTap}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-container active:scale-95 transition-colors shadow-md group cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#ffd9b7] group-hover:rotate-12 transition-transform duration-300" />
              <span>Generate my trip</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.section>
  );
}
