import type { Metadata } from "next";
import { displayFont, bodyFont } from "@/lib/fonts";
import { Providers } from "@/lib/trpc/provider";
import { ToastRegion } from "@/components/ui/toast";
import "./globals.css";

/**
 * @seo-specialist: Metadata for internal tool — descriptive title,
 * no-index for internal apps, proper Open Graph for link previews
 * in Slack/Teams.
 */

export const metadata: Metadata = {
  title: {
    default: "CINEFORGE",
    template: "%s | CINEFORGE",
  },
  description: "Internal film management system for CINEFORGE Studios",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <ToastRegion />
        </Providers>
      </body>
    </html>
  );
}
