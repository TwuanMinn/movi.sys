"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

/**
 * @frontend-specialist: Top header bar — breadcrumbs, search, notifications.
 * Sticky with backdrop blur for depth.
 */

const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  movies: "Movies",
  team: "Team",
  assets: "Assets",
  calendar: "Calendar",
  analytics: "Analytics",
  promotion: "Promotion",
  reports: "Reports",
  settings: "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { notificationCount } = useUIStore();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg) => BREADCRUMB_MAP[seg] ?? seg);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
      {/* Breadcrumbs — leave room for hamburger on mobile */}
      <nav className="flex items-center gap-1.5 text-sm pl-10 lg:pl-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-[var(--color-text-muted)]">/</span>
            )}
            <span
              className={cn(
                i === breadcrumbs.length - 1
                  ? "font-medium text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)]"
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search — hidden on small screens, expands on focus */}
        <div className="relative hidden md:block group">
          <input
            type="text"
            placeholder="Search films, people..."
            className="h-8 w-44 lg:w-56 focus:w-64 lg:focus:w-72 rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-3 pl-8 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)]/50 focus:outline-none transition-all duration-300 ease-[var(--ease-smooth)]"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] transition-transform duration-200 group-focus-within:scale-110">
            ⌕
          </span>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
          aria-label="Notifications"
        >
          <span>◉</span>
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-[9px] font-bold text-[var(--color-text-inverse)] anim-pulse-glow"
            >
              {notificationCount}
            </motion.span>
          )}
        </motion.button>
      </div>
    </header>
  );
}
