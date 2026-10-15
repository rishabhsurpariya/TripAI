import { TravelStyle } from "@/types/trip";

export const INTERESTS = [
  "Beaches",
  "Mountains",
  "Heritage",
  "Food",
  "Adventure",
  "Spiritual",
  "Wildlife",
  "Nightlife",
] as const;

export type Interest = (typeof INTERESTS)[number];

export const SEASONS = ["Summer", "Monsoon", "Winter", "Spring"] as const;

export type Season = (typeof SEASONS)[number];

export const TRAVEL_STYLES: {
  id: TravelStyle;
  label: string;
  description: string;
}[] = [
  {
    id: "budget",
    label: "Budget",
    description: "Hostels, street food, public transport, maximum value",
  },
  {
    id: "comfort",
    label: "Comfort",
    description: "Boutique hotels, curated restaurants, private cabs",
  },
  {
    id: "adventure",
    label: "Adventure",
    description: "Offbeat stays, treks, outdoor thrills, local guides",
  },
];
