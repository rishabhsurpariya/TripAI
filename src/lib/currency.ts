/**
 * Supported currencies for TripAi.
 * Amounts are stored as plain numbers in the trip's currency — no conversion, no exchange rates.
 */

export const SUPPORTED_CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "THB", symbol: "฿", label: "Thai Baht" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "IDR", symbol: "Rp", label: "Indonesian Rupiah" },
  { code: "MYR", symbol: "RM", label: "Malaysian Ringgit" },
] as const;

export type SupportedCurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: SupportedCurrencyCode = "INR";

/**
 * All valid currency codes as a plain string array (for Zod validation).
 */
export const SUPPORTED_CURRENCY_CODES = SUPPORTED_CURRENCIES.map((c) => c.code) as [
  string,
  ...string[]
];

/**
 * Returns the symbol for an ISO 4217 currency code, falling back to the code itself.
 */
export function getCurrencySymbol(code: string): string {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return found ? found.symbol : code;
}

/**
 * Locale map to ensure proper number grouping per currency.
 * For example INR uses the Indian number system (1,00,000 not 100,000).
 */
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  INR: "en-IN",
  JPY: "ja-JP",
  THB: "th-TH",
  IDR: "id-ID",
  MYR: "ms-MY",
  AED: "ar-AE",
};

function getLocaleForCurrency(code: string): string {
  return CURRENCY_LOCALE_MAP[code] || "en-US";
}

/**
 * Format a numeric amount using the trip's currency with Intl.NumberFormat.
 * - Uses the correct locale grouping (e.g. Indian grouping for INR).
 * - Uses maximumFractionDigits: 0 for whole currencies, 2 for others except JPY.
 * - Never hard-codes a currency symbol; uses the browser's formatting.
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  options?: { compact?: boolean }
): string {
  const locale = getLocaleForCurrency(currencyCode);
  const noDecimals = ["JPY", "INR", "IDR", "THB"].includes(currencyCode);

  if (options?.compact && Math.abs(amount) >= 1000) {
    // For compact display on cards: abbreviate large numbers
    const compactLocale = getLocaleForCurrency(currencyCode);
    try {
      return new Intl.NumberFormat(compactLocale, {
        style: "currency",
        currency: currencyCode,
        notation: "compact",
        maximumFractionDigits: noDecimals ? 0 : 1,
      }).format(amount);
    } catch {
      // Fall through to standard formatting
    }
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: noDecimals ? 0 : 0,
    }).format(amount);
  } catch {
    // Fallback if browser doesn't support the currency
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
}

/**
 * Guess a sensible default currency from the browser's locale.
 * Returns a SupportedCurrencyCode or DEFAULT_CURRENCY if no match found.
 */
export function guessCurrencyFromLocale(): SupportedCurrencyCode {
  if (typeof navigator === "undefined") return DEFAULT_CURRENCY;

  const locale = navigator.language || "";

  const localeMap: Record<string, SupportedCurrencyCode> = {
    "en-IN": "INR",
    hi: "INR",
    "hi-IN": "INR",
    "en-US": "USD",
    "en-GB": "GBP",
    "de-DE": "EUR",
    "fr-FR": "EUR",
    "it-IT": "EUR",
    "es-ES": "EUR",
    "en-AU": "AUD",
    "en-CA": "CAD",
    "en-SG": "SGD",
    "en-AE": "AED",
    ar: "AED",
    th: "THB",
    ja: "JPY",
    "ja-JP": "JPY",
    "id-ID": "IDR",
    id: "IDR",
    "ms-MY": "MYR",
    ms: "MYR",
  };

  // Try full match first, then language prefix
  if (localeMap[locale]) return localeMap[locale];
  const lang = locale.split("-")[0];
  return localeMap[lang] || DEFAULT_CURRENCY;
}
