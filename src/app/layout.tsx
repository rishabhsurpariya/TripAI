import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { Toaster } from "@/components/common/toast";
import LayoutShell from "@/components/motion/LayoutShell";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripAi — AI Travel Itinerary Planner",
  description: "Bespoke AI journey architect and travel itinerary planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fef9f2] text-[#1d1b18]">
        {/* LayoutShell provides AnimatePresence for page exit/enter transitions */}
        <LayoutShell>{children}</LayoutShell>
        <Toaster />
      </body>
    </html>
  );
}
