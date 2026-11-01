import { AFFILIATE_PARTNERS, AffiliateCategory, AffiliatePartner } from "@/config/affiliates";
import { Trip, TransportOption } from "@/types/trip";

export interface BookingLinkOptions {
  partnerId: string;
  trip: Trip;
  dayNumber?: number;
  hotelName?: string;
  transportMode?: TransportOption["mode"];
}

/**
 * Calculates a YYYY-MM-DD date offset from a base ISO/date string.
 * Returns empty string if startDate is invalid or missing.
 */
function calculateOffsetDate(startDate: string | undefined, offsetDays: number): string {
  if (!startDate) return "";
  const d = new Date(startDate);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

/**
 * Validates that an outbound URL strictly uses HTTPS and targets an approved partner domain.
 */
export function isValidPartnerUrl(urlStr: string, allowedDomains: string[]): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname.toLowerCase();
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Builds an outbound affiliate link for a given partner and trip context.
 * Strictly adheres to safety and privacy:
 * - Only transmits destination, country, dates (if startDate exists), traveler count, and currency.
 * - Never transmits user identifiers, emails, trip IDs, or notes.
 * - Every value is safely URL-encoded.
 * - Restricts outbound links exclusively to verified HTTPS partner domains.
 */
export function buildBookingLink(options: BookingLinkOptions): string | null {
  const { partnerId, trip, dayNumber, hotelName, transportMode } = options;

  const partner = AFFILIATE_PARTNERS.find((p) => p.id === partnerId);
  if (!partner) return null;

  // Destination & location details
  const destination = encodeURIComponent(
    hotelName ? `${hotelName}, ${trip.destination}` : trip.destination || ""
  );
  const city = encodeURIComponent(trip.destination || "");
  const country = encodeURIComponent(trip.country || "");
  const startCity = encodeURIComponent(trip.startCity || "Delhi");

  // Dates: only populate if trip has an explicit startDate; otherwise leave empty
  const hasStartDate = Boolean(trip.startDate);
  let checkin = "";
  let checkout = "";
  let travelDate = "";

  if (hasStartDate && trip.startDate) {
    const dayOffset = (dayNumber || 1) - 1;
    checkin = encodeURIComponent(calculateOffsetDate(trip.startDate, dayOffset));
    checkout = encodeURIComponent(calculateOffsetDate(trip.startDate, dayOffset + 1));
    travelDate = encodeURIComponent(trip.startDate);
  }

  // Adults and currency
  const adults = encodeURIComponent(String(trip.travelers || 2));
  const currency = encodeURIComponent(trip.currency || "INR");

  // Affiliate parameter
  let affiliateParam = "";
  if (partner.affiliateId) {
    if (partner.id === "booking-com") {
      affiliateParam = `&aid=${encodeURIComponent(partner.affiliateId)}`;
    } else if (partner.id === "agoda") {
      affiliateParam = `&cid=${encodeURIComponent(partner.affiliateId)}`;
    }
  }

  // Replace placeholders in URL template
  let finalUrl = partner.urlTemplate
    .replace(/\{destination\}/g, destination)
    .replace(/\{city\}/g, city)
    .replace(/\{country\}/g, country)
    .replace(/\{checkin\}/g, checkin)
    .replace(/\{checkout\}/g, checkout)
    .replace(/\{adults\}/g, adults)
    .replace(/\{currency\}/g, currency)
    .replace(/\{from\}/g, startCity)
    .replace(/\{to\}/g, city)
    .replace(/\{date\}/g, travelDate)
    .replace(/\{affiliateParam\}/g, affiliateParam);

  // Clean empty query parameters from URL if dates were omitted
  try {
    const parsed = new URL(finalUrl);
    const keysToDelete: string[] = [];
    parsed.searchParams.forEach((val, key) => {
      if (!val || val.trim() === "") {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => parsed.searchParams.delete(key));
    finalUrl = parsed.toString();
  } catch {
    // If not standard query URL (e.g. path-based), continue
  }

  // Domain security verification
  if (!isValidPartnerUrl(finalUrl, partner.allowedDomains)) {
    console.warn(`[Affiliate] URL failed domain security check: ${finalUrl}`);
    return null;
  }

  return finalUrl;
}

/**
 * Returns available partners for a category (hotel, flight, train, bus).
 */
export function getPartnersForCategory(category: AffiliateCategory): AffiliatePartner[] {
  return AFFILIATE_PARTNERS.filter((p) => p.category === category);
}

