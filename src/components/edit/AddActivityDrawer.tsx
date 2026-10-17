"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Plus,
  Save,
  MapPin,
  Clock,
  Sparkles,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Activity } from "@/types/trip";

export interface AddActivityDrawerProps {
  isOpen: boolean;
  dayNumber: number;
  destination: string;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
}

// Curated suggestion catalog for adding stops
const CURATED_SUGGESTIONS: Array<Omit<Activity, "id">> = [
  {
    name: "Mangueshi Temple Morning Aarti",
    description: "400-year-old deepastambha tower and peaceful morning rituals before crowds gather.",
    timeSlot: "Morning · 09:30 AM",
    durationMinutes: 90,
    estimatedCost: 0,
    category: "Culture & Sights",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    lat: 15.435,
    lng: 73.967,
    note: "Wear modest clothing covering shoulders and knees for temple sanctum.",
  },
  {
    name: "Tropical Spice Plantation & Cashew Feni Tasting",
    description: "Guided walk through aromatic vanilla, pepper orchards and traditional copper pot still demonstration.",
    timeSlot: "Afternoon · 01:30 PM",
    durationMinutes: 120,
    estimatedCost: 400,
    category: "Food & Bakeries",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    lat: 15.402,
    lng: 74.015,
    note: "Banana-leaf buffet lunch is included with fresh estate-grown cardamom.",
  },
  {
    name: "Sunset Catamaran on the Estuary",
    description: "Sail past sleepy mangrove channels and bird sanctuaries away from crowded tourist boats.",
    timeSlot: "Golden Hour · 05:00 PM",
    durationMinutes: 120,
    estimatedCost: 1200,
    category: "Experiences",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    lat: 15.502,
    lng: 73.832,
    note: "Golden light over the water is breathtaking from 5:15 to 6:00 PM.",
  },
  {
    name: "Artisan Bakery & High Tea at Cafe Bodega",
    description: "Wood-fired Portuguese custard tarts, fresh sourdough, and single-origin estate coffees.",
    timeSlot: "Late Afternoon · 04:00 PM",
    durationMinutes: 60,
    estimatedCost: 350,
    category: "Food & Bakeries",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    lat: 15.495,
    lng: 73.829,
  },
  {
    name: "Serene Bamboo Grove & Yoga Pavilion",
    description: "Tranquil open-air meditation session amidst swaying bamboo canes and birdsong.",
    timeSlot: "Morning · 08:00 AM",
    durationMinutes: 75,
    estimatedCost: 500,
    category: "Relax",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    lat: 15.485,
    lng: 73.815,
  },
  {
    name: "Historic Fort Ramparts & Lighthouse Overlook",
    description: "Climb restored 16th-century fortress bastions with panoramic views where the river embraces the sea.",
    timeSlot: "Late Afternoon · 04:30 PM",
    durationMinutes: 90,
    estimatedCost: 100,
    category: "Sights & Forts",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    lat: 15.502,
    lng: 73.805,
  },
];

export function AddActivityDrawer({
  isOpen,
  dayNumber,
  destination,
  onClose,
  onAddActivity,
}: AddActivityDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Custom Form state
  const [customName, setCustomName] = useState("");
  const [customTime, setCustomTime] = useState("Morning · 10:30 AM");
  const [customDuration, setCustomDuration] = useState("1.5h");
  const [customCost, setCustomCost] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const categories = [
    "All",
    "Sights & Forts",
    "Food & Bakeries",
    "Experiences",
    "Relax",
  ];

  const filteredSuggestions = useMemo(() => {
    return CURATED_SUGGESTIONS.filter((item) => {
      const matchCat =
        selectedCategory === "All" ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddCurated = (item: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    onAddActivity(newActivity);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const parsedHours = parseFloat(customDuration) || 1.5;
    const parsedCost = parseInt(customCost.replace(/[^0-9]/g, ""), 10) || 0;

    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: customName.trim(),
      description:
        customDescription.trim() ||
        `Custom travel stop added by user for Day ${dayNumber}.`,
      timeSlot: customTime,
      durationMinutes: Math.round(parsedHours * 60),
      estimatedCost: parsedCost,
      category: "Custom Stop",
      imageUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
      lat: 0,
      lng: 0,
    };

    onAddActivity(newActivity);
    // Reset form
    setCustomName("");
    setCustomDescription("");
    setCustomCost("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="fixed inset-0 bg-[#54381d]/35 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={{ x: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#d3c4b9]/60"
          >
            {/* Top Bar */}
            <div className="p-5 border-b border-[#d3c4b9]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#54381d]">
                <Compass className="w-5 h-5 text-[#75593e]" />
                <h3 className="font-serif text-xl font-bold">
                  Add Stop to Day {dayNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#f8f3ed] hover:bg-[#ece7e1] flex items-center justify-center text-[#54381d] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#81756b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search temples, cafes, coastal stops..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#f8f3ed] text-xs sm:text-sm text-[#54381d] placeholder-[#81756b] border border-[#d3c4b9]/50 focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#6e4f32] text-white shadow-xs"
                        : "bg-[#ece7e1] text-[#4d3a28] hover:bg-[#ded9d4]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Curated Suggestions List */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#75593e]">
                  Curated for {destination} · Day {dayNumber}
                </p>

                {filteredSuggestions.length === 0 ? (
                  <p className="text-xs text-[#81756b] italic py-2">
                    No matching suggestions found. Use the form below to create your own custom stop!
                  </p>
                ) : (
                  filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#f8f3ed] border border-[#d3c4b9]/40 flex items-center justify-between gap-3 hover:border-[#6e4f32]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#ece7e1]">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-bold text-[#54381d] truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#81756b]">
                            {item.timeSlot} &bull; {(item.durationMinutes / 60).toFixed(1)}h
                          </p>
                          <p className="text-[11px] font-semibold text-[#6e4f32] mt-0.5">
                            {item.estimatedCost > 0
                              ? `$${item.estimatedCost} est.`
                              : "Free entry"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddCurated(item)}
                        className="px-3 py-1.5 rounded-full bg-[#6e4f32] hover:bg-[#54381d] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-transform active:scale-95 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Custom Stop Accordion Form */}
              <div className="pt-4 border-t border-[#d3c4b9]/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#75593e] mb-3">
                  Or Add Your Own Custom Stop
                </p>

                <form onSubmit={handleCreateCustom} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-[#4d3a28] font-medium block mb-1">
                      Stop Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Cafe Bodega, Sunset viewpoint"
                      className="w-full px-3 py-2 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/60 text-xs text-[#54381d] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#4d3a28] font-medium block mb-1">
                        Time Slot
                      </label>
                      <select
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/60 text-xs text-[#54381d] focus:outline-none cursor-pointer"
                      >
                        <option>Morning · 09:30 AM</option>
                        <option>Morning · 10:30 AM</option>
                        <option>Afternoon · 01:30 PM</option>
                        <option>Late Afternoon · 04:00 PM</option>
                        <option>Golden Hour · 05:00 PM</option>
                        <option>Evening · 06:30 PM</option>
                        <option>Night · 08:30 PM</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#4d3a28] font-medium block mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        placeholder="e.g. 1.5h, 2h"
                        className="w-full px-3 py-2 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/60 text-xs text-[#54381d] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#4d3a28] font-medium block mb-1">
                        Estimated Cost ($)
                      </label>
                      <input
                        type="text"
                        value={customCost}
                        onChange={(e) => setCustomCost(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-full px-3 py-2 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/60 text-xs text-[#54381d] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#4d3a28] font-medium block mb-1">
                        Optional Note
                      </label>
                      <input
                        type="text"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="e.g. Best coffee in town"
                        className="w-full px-3 py-2 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/60 text-xs text-[#54381d] focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl border border-[#6e4f32] text-[#54381d] hover:bg-[#6e4f32] hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Create Custom Stop</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-[#d3c4b9]/40 bg-[#f8f3ed] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full border border-[#d3c4b9] hover:bg-white text-xs font-semibold text-[#54381d] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
