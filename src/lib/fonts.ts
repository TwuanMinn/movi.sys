import { Manrope, Inter } from "next/font/google";

export const displayFont = Manrope({
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
