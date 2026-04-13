import type { Metadata } from "next";
import { Providers } from "@/lib/trpc/provider";
import { ToastRegion } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
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
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <ThemeProvider>
            {children}
            <ToastRegion />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
