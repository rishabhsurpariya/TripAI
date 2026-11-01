export type AffiliateCategory = "hotel" | "flight" | "train" | "bus";

export interface AffiliatePartner {
  id: string;
  name: string;
  category: AffiliateCategory;
  urlTemplate: string;
  affiliateId: string;
  allowedDomains: string[];
  isConfident: boolean;
  confidenceNote?: string;
}

/**
 * Registry of outbound affiliate booking partners.
 * All URLs use placeholders: {destination}, {city}, {country}, {checkin}, {checkout}, {adults}, {currency}, {from}, {to}, {date}
 *
 * If the affiliate ID environment variable is empty, links function as clean direct search links without tracking parameters.
 */
export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // --- HOTELS ---
  {
    id: "booking-com",
    name: "Booking.com",
    category: "hotel",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_BOOKING_ID || "",
    allowedDomains: ["www.booking.com", "booking.com"],
    isConfident: true,
    confidenceNote:
      "Standard Booking.com search results format with 'ss' query, guest count, dates, and currency.",
    urlTemplate:
      "https://www.booking.com/searchresults.html?ss={destination}&checkin={checkin}&checkout={checkout}&group_adults={adults}&selected_currency={currency}{affiliateParam}",
  },
  {
    id: "agoda",
    name: "Agoda",
    category: "hotel",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_AGODA_ID || "",
    allowedDomains: ["www.agoda.com", "agoda.com"],
    isConfident: true,
    confidenceNote:
      "Agoda universal search endpoint with free-form text query, dates, adults, and currency.",
    urlTemplate:
      "https://www.agoda.com/search?text={destination}&checkIn={checkin}&checkOut={checkout}&adults={adults}&currency={currency}{affiliateParam}",
  },

  // --- FLIGHTS ---
  {
    id: "google-flights",
    name: "Google Flights",
    category: "flight",
    affiliateId: "",
    allowedDomains: ["www.google.com"],
    isConfident: true,
    confidenceNote:
      "Google Flights query endpoint accepts natural city names without requiring 3-letter IATA airport codes.",
    urlTemplate:
      "https://www.google.com/travel/flights?q=flights+from+{from}+to+{to}",
  },
  {
    id: "skyscanner",
    name: "Skyscanner",
    category: "flight",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_SKYSCANNER_ID || "",
    allowedDomains: ["www.skyscanner.net", "www.skyscanner.com", "www.google.com"],
    isConfident: false,
    confidenceNote:
      "Skyscanner native deep links require 3-letter IATA airport codes in URL paths (e.g. /transport/flights/del/goi). Since trip startCity and destination are city names, we use a targeted search redirect format as a safe fallback to prevent broken paths.",
    urlTemplate:
      "https://www.google.com/search?q=skyscanner+flights+from+{from}+to+{to}",
  },

  // --- TRAINS ---
  {
    id: "confirmtkt",
    name: "ConfirmTkt (IRCTC)",
    category: "train",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_CONFIRMTKT_ID || "",
    allowedDomains: ["www.confirmtkt.com", "confirmtkt.com", "www.google.com"],
    isConfident: false,
    confidenceNote:
      "ConfirmTkt is India's leading IRCTC train booking platform. Because city names often differ from specific railway station codes (e.g. Goa vs Madgaon MAO), we provide a targeted search redirect fallback to ensure valid search results.",
    urlTemplate:
      "https://www.confirmtkt.com/train-search/{from}-to-{to}",
  },
  {
    id: "thetrainline",
    name: "Trainline",
    category: "train",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_TRAINLINE_ID || "",
    allowedDomains: ["www.thetrainline.com", "thetrainline.com"],
    isConfident: true,
    confidenceNote:
      "Trainline standard search results endpoint for international rail routes with origin and destination query parameters.",
    urlTemplate:
      "https://www.thetrainline.com/search/results?origin={from}&destination={to}",
  },

  // --- BUSES ---
  {
    id: "redbus",
    name: "redBus",
    category: "bus",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_REDBUS_ID || "",
    allowedDomains: ["www.redbus.in", "redbus.in"],
    isConfident: true,
    confidenceNote:
      "redBus intercity route URL format for buses in India and Southeast Asia (/bus-tickets/{from}-to-{to}).",
    urlTemplate:
      "https://www.redbus.in/bus-tickets/{from}-to-{to}",
  },
  {
    id: "busbud",
    name: "Busbud",
    category: "bus",
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_BUSBUD_ID || "",
    allowedDomains: ["www.busbud.com", "busbud.com"],
    isConfident: true,
    confidenceNote:
      "Busbud international bus schedule query path (/en/bus-schedules/{from}/{to}).",
    urlTemplate:
      "https://www.busbud.com/en/bus-schedules/{from}/{to}",
  },
];

