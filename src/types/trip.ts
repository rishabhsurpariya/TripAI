export type TravelStyle = "budget" | "comfort" | "adventure";

export interface Activity {
  id: string;
  name: string;
  description: string;
  timeSlot: "morning" | "afternoon" | "evening" | string;
  durationMinutes: number;
  estimatedCost: number;
  category: string;
  imageUrl: string;
  lat: number;
  lng: number;
  note?: string; // sticky note text
  noteColor?: string;
}

export interface Stay {
  id: string;
  name: string;
  pricePerNight: number;
  distanceFromStopsKm: number;
  imageUrl: string;
}

export interface Day {
  id: string;
  dayNumber: number;
  title: string;
  date?: string;
  notes?: string; // day-level sticky note
  activities: Activity[];
  stay: Stay;
  localTransport: string[];
}

export interface TransportOption {
  mode: "train" | "bus" | "flight";
  durationHours: number;
  estimatedCost: number;
  tag?: "best value" | "fastest";
  tip?: string;
}

export interface BudgetBreakdown {
  transport: number;
  stay: number;
  food: number;
  activities: number;
  misc: number;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  coverImageUrl: string;
  days: Day[];
  travelers: number;
  style: TravelStyle;
  startCity?: string;
  totalBudget: number;
  currency: string; // ISO 4217 code, e.g. "INR", "USD", "EUR"
  gettingThere: TransportOption[];
  budget: BudgetBreakdown;
  interests: string[];
  seasons: string[];
  shareId?: string;
  isShared?: boolean;
  startDate?: string;
  endDate?: string;
}
