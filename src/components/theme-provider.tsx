"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui-store";

/**
 * ThemeProvider — Applies the resolved theme class ('dark' | 'light')
 * to <html> based on store state. Handles 'system' preference via
 * matchMedia listener.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;

    function apply(resolved: "dark" | "light") {
      if (resolved === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    }

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: light)");
      apply(mq.matches ? "light" : "dark");

      const handler = (e: MediaQueryListEvent) =>
        apply(e.matches ? "light" : "dark");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    apply(theme);
  }, [theme]);

  return <>{children}</>;
}
