"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { useEffect } from "react";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "◆" },
  { label: "Movies", href: "/movies", icon: "▶" },
  { label: "Team", href: "/team", icon: "◈" },
  { label: "Assets", href: "/assets", icon: "◐" },
  { label: "Calendar", href: "/calendar", icon: "◧" },
  { label: "Analytics", href: "/analytics", icon: "◰" },
  { label: "Promotion", href: "/promotion", icon: "◎" },
  { label: "Announcements", href: "/announcements", icon: "📣" },
  { label: "Reports", href: "/reports", icon: "▣" },
  { label: "Settings", href: "/settings", icon: "⚙", roles: ["admin"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileMenuOpen, toggleSidebar, setMobileMenuOpen } = useUIStore();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileMenuOpen]);

  return (
    <>
      {/* Mobile hamburger button — shown only below lg */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] lg:hidden transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
        aria-label="Open menu"
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 64 : 240,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] flex flex-col transition-transform duration-300 ease-[var(--ease-smooth)]",
          // Mobile: off-canvas by default, slide in when open
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible
          "lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-border-subtle)]">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-[family-name:var(--font-display)] text-lg font-bold tracking-wider text-[var(--color-accent-primary)]"
              >
                CINEFORGE
              </motion.span>
            )}
          </AnimatePresence>
          {/* Collapse toggle — desktop only | Close button — mobile only */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileMenuOpen(false);
              } else {
                toggleSidebar();
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.span
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="hidden lg:inline">◁</span>
              <span className="lg:hidden">✕</span>
            </motion.span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-all duration-[var(--duration-fast)]",
                  isActive
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--color-accent-primary)]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <motion.span 
                  className="text-base leading-none inline-block"
                  whileHover={{ y: -2, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  {item.icon}
                </motion.span>
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Tooltip when collapsed */}
                {sidebarCollapsed && (
                  <span
                    className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] opacity-0 scale-90 origin-left transition-all duration-150 ease-[var(--ease-spring)] group-hover:opacity-100 group-hover:scale-100 shadow-[var(--shadow-md)] z-50"
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User */}
        <div className="border-t border-[var(--color-border-subtle)] px-2 py-4">
          <div className="flex items-center gap-3 px-3">
            <div className="h-8 w-8 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-xs font-bold text-[var(--color-text-inverse)]">
              CF
            </div>
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    Studio User
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    Director
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
