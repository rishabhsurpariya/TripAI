"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import {
  Download,
  Building2,
  Bike,
  Compass,
  UtensilsCrossed,
  Wallet,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import { Trip } from "@/types/trip";
import { easing } from "@/lib/motion";

interface BudgetTabProps {
  trip: Trip;
}

// Animated counting number — counts up smoothly from 0 to target
function AnimatedNumber({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      if (ref.current) ref.current.textContent = `${prefix}${value.toLocaleString()}`;
      return;
    }
    const unsubscribe = animate(motionVal, value, {
      duration: 1.1,
      ease: [0.25, 0.1, 0.25, 1],
    });
    const unsub = springVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}`;
      }
    });
    return () => {
      unsubscribe.stop?.();
      unsub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, value]);

  return <span ref={ref}>{prefix}0</span>;
}

const emptySubscribe = () => () => {};

export function BudgetTab({ trip }: BudgetTabProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [downloading, setDownloading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const budget = trip.budget || {
    stay: 35000,
    transport: 18000,
    food: 22000,
    activities: 15000,
    misc: 5000,
  };

  const totalBudgetCap = trip.totalBudget || 95000;
  const committedCost =
    budget.stay +
    budget.transport +
    budget.food +
    budget.activities +
    (budget.misc || 0);

  const bufferLeft = Math.max(0, totalBudgetCap - committedCost);
  const percentSpent = Math.min(
    100,
    Math.round((committedCost / totalBudgetCap) * 100)
  );
  const percentBuffer = (100 - percentSpent).toFixed(1);

  const chartData = [
    { name: "Boutique Stays", value: budget.stay, color: "#6e4f32" },
    { name: "Transport & Passes", value: budget.transport, color: "#8c6d4f" },
    { name: "Dining & Culinary", value: budget.food, color: "#b58d67" },
    { name: "Activities & Entries", value: budget.activities, color: "#d9ab7e" },
    { name: "Buffer & Misc", value: budget.misc || 5000, color: "#dec1a9" },
  ];

  const handleDownloadCsv = () => {
    setDownloading(true);
    setTimeout(() => {
      // Build simple CSV string
      const csvRows = [
        ["Category", "Item Description", "Estimated Cost ($)"],
        ["Stays", "Noku Kyoto Boutique Hotel (5 Nights)", budget.stay],
        ["Transport", "Shinkansen & Kyoto Transit Passes", budget.transport],
        ["Dining", "Pontocho Kaiseki & Nishiki Food", budget.food],
        ["Activities", "Matcha Ceremony & Temple Admissions", budget.activities],
        ["Misc", "Emergency cushion & luggage storage", budget.misc || 5000],
        ["TOTAL COMMITTED", "", committedCost],
        ["BUDGET CAP", "", totalBudgetCap],
      ];
      const csvContent =
        "data:text/csv;charset=utf-8," +
        csvRows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `${trip.destination.toLowerCase()}-budget-ledger.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header (Stitch design lines 685-694) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">
            Expense Journal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary mt-0.5">
            Comprehensive Budget Ledger
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Complete cost allocation across stays, transit, daily activities, and dining.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadCsv}
          disabled={downloading}
          className="px-4 py-2 rounded-full border border-secondary text-primary hover:bg-surface-container font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-secondary" />
          <span>{downloading ? "Exporting..." : "Download CSV"}</span>
        </button>
      </div>

      {/* TOP SUMMARY STATS CARD (Stitch lines 695-716) */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden">
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Total Budget
              </p>
              <p className="font-serif text-2xl text-primary font-bold mt-0.5">
                <AnimatedNumber value={totalBudgetCap} />
              </p>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/60 hidden sm:block" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Committed Cost
              </p>
              <p className="font-serif text-2xl text-secondary font-bold mt-0.5">
                <AnimatedNumber value={committedCost} />
              </p>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/60 hidden sm:block" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Buffer Cushion
              </p>
              <p className="font-serif text-2xl text-emerald-800 font-bold mt-0.5">
                <AnimatedNumber value={bufferLeft} />
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
            <span className="px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold shadow-xs">
              Status: Healthy Margin ({percentBuffer}% Unspent)
            </span>
            {/* Required: Add a small "estimates only" note near the figures */}
            <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-light italic">
              <Info className="w-3 h-3 text-secondary" />
              * Estimates only based on average seasonal rates
            </span>
          </div>
        </div>

        {/* DONUT CHART & CATEGORY BREAKDOWN (Recharts) — animates in on scroll */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-outline-variant/30">
          {/* Donut Chart Visualization */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: easing }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[260px]"
          >
            {mounted ? (
              <div className="w-full h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={96}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [
                        `$${Number(val).toLocaleString()}`,
                        "Budget",
                      ]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#d3c4b9",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center of Donut Summary */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                    Total
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-primary">
                    <AnimatedNumber value={committedCost} />
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {percentSpent}% allocated
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full border-8 border-surface-container-high border-t-primary animate-pulse" />
            )}
          </motion.div>

          {/* Category Chips and Details */}
          <div className="lg:col-span-7 flex flex-col space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Category Allocations
              </span>
              <span className="text-xs text-on-surface-variant">
                Share of Total Spend
              </span>
            </div>

            <div className="space-y-2.5">
              {chartData.map((item) => {
                const pct = committedCost
                  ? ((item.value / committedCost) * 100).toFixed(1)
                  : "0";

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-serif text-sm font-medium text-primary">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-sm font-bold text-primary">
                        ${item.value.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-secondary font-medium w-12 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note near figures */}
            <div className="pt-2 text-right">
              <span className="text-[10px] text-on-surface-variant italic">
                All figures are estimates only. Local taxes and tips may vary.
              </span>
            </div>
          </div>
        </div>

        {/* DETAILED ITEMIZED LEDGER ROWS (Stitch lines 717-763) */}
        <div className="divide-y divide-outline-variant/30 text-xs">
          <div className="p-4 flex items-center justify-between font-bold uppercase tracking-wider text-secondary text-[11px] bg-surface-container-low/50">
            <span>Item &amp; Category</span>
            <span>Allocated Sum</span>
          </div>

          {/* Row 1: Stays */}
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-primary">
                  {trip.days?.[0]?.stay?.name || "Boutique Hotel"} (5 Nights Stay)
                </p>
                <p className="text-on-surface-variant text-[11px]">
                  Central {trip.destination} · Confirmed Booking
                </p>
              </div>
            </div>
            <span className="font-serif text-sm font-bold text-on-surface">
              ${budget.stay.toLocaleString()}
            </span>
          </div>

          {/* Row 2: Transport */}
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Bike className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-primary">
                  Bullet Train, Express &amp; Regional Passes
                </p>
                <p className="text-on-surface-variant text-[11px]">
                  {trip.startCity ? `From ${trip.startCity} · ` : ""}Mobility &amp; Subway IC Allowance
                </p>
              </div>
            </div>
            <span className="font-serif text-sm font-bold text-on-surface">
              ${budget.transport.toLocaleString()}
            </span>
          </div>

          {/* Row 3: Activities */}
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Compass className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-primary">
                  Tea Ceremonies, Temple Passes &amp; Garden Admissions
                </p>
                <p className="text-on-surface-variant text-[11px]">
                  Entry fees, private tea master &amp; museum tickets
                </p>
              </div>
            </div>
            <span className="font-serif text-sm font-bold text-on-surface">
              ${budget.activities.toLocaleString()}
            </span>
          </div>

          {/* Row 4: Food & Dining */}
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-primary">
                  Riverside Dining, Food Arcades &amp; Bakeries Reserve
                </p>
                <p className="text-on-surface-variant text-[11px]">
                  Pontocho dinners, Nishiki Market tastings &amp; matcha sweets
                </p>
              </div>
            </div>
            <span className="font-serif text-sm font-bold text-on-surface">
              ${budget.food.toLocaleString()}
            </span>
          </div>

          {/* Row 5: Buffer / Misc */}
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-primary">
                  Station Lockers, Contingency &amp; Souvenirs Reserve
                </p>
                <p className="text-on-surface-variant text-[11px]">
                  Luggage forwarders and unforeseen emergency cushion
                </p>
              </div>
            </div>
            <span className="font-serif text-sm font-bold text-on-surface">
              ${(budget.misc || 5000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
