"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { DEMO_COOKIE_NAME, decodeDemoSession, clearDemoSession, ROLE_META, type DemoRole } from "@/lib/demo-auth";
/**
 * Material Symbols icon component — renders Google Material Symbols Outlined
 * with proper font-variation-settings for weight/fill control.
 */
function MIcon({
  name,
  filled,
  className,
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined text-[20px] leading-none", className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}

const NAV_ITEMS: (NavItem & { msIcon: string })[] = [
  { label: "Dashboard", href: "/dashboard", icon: "◆", msIcon: "dashboard" },
  { label: "Movies", href: "/movies", icon: "▶", msIcon: "movie" },
  { label: "Team", href: "/team", icon: "◈", msIcon: "groups" },
  { label: "Assets", href: "/assets", icon: "◐", msIcon: "inventory_2" },
  { label: "Calendar", href: "/calendar", icon: "◧", msIcon: "calendar_today" },
  { label: "Analytics", href: "/analytics", icon: "◰", msIcon: "bar_chart" },
  { label: "Promotion", href: "/promotion", icon: "◎", msIcon: "campaign" },
  { label: "Announcements", href: "/announcements", icon: "◫", msIcon: "notifications" },
  { label: "Reports", href: "/reports", icon: "▣", msIcon: "summarize" },
  { label: "Settings", href: "/settings", icon: "⚙", msIcon: "settings", roles: ["admin"] },
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

  const router = useRouter();
  const { data: session } = useSession();

  // Read demo session from cookie as fallback
  const demoUser = useMemo(() => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`${DEMO_COOKIE_NAME}=([^;]+)`));
    if (!match) return null;
    return decodeDemoSession(match[1]);
  }, []);

  // Unified user object: prefer real session, fall back to demo
  const activeUser = session?.user
    ? { name: session.user.name || "User", email: session.user.email || "", image: session.user.image, role: null as DemoRole | null }
    : demoUser
      ? { name: demoUser.name, email: demoUser.email, image: null as string | null, role: demoUser.role }
      : { name: "Guest", email: "", image: null as string | null, role: null as DemoRole | null };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    // Clear demo cookie
    clearDemoSession();
    // Also sign out of Better Auth if applicable
    try { await signOut(); } catch {}
    router.push("/login");
  };

  return (
    <>
      {/* Mobile hamburger button — shown only below lg */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] lg:hidden transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
        aria-label="Open menu"
      >
        <MIcon name="menu" />
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
          width: sidebarCollapsed ? 80 : 288,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-white/[0.06] bg-[#0b0c14] flex flex-col transition-transform duration-300 ease-[var(--ease-smooth)] overflow-hidden",
          // Mobile: off-canvas by default, slide in when open
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible
          "lg:translate-x-0"
        )}
      >
        {/* ── Floating blur bubbles ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
          <div className="sidebar-bubble absolute w-20 h-20 rounded-full bg-[#4b8eff]/[0.04] blur-2xl" style={{ top: '12%', left: '10%', animationDuration: '18s', animationDelay: '0s' }} />
          <div className="sidebar-bubble absolute w-14 h-14 rounded-full bg-[#BD93F9]/[0.05] blur-2xl" style={{ top: '45%', left: '60%', animationDuration: '22s', animationDelay: '-5s' }} />
          <div className="sidebar-bubble absolute w-24 h-24 rounded-full bg-[#8BE9FD]/[0.03] blur-3xl" style={{ top: '70%', left: '20%', animationDuration: '25s', animationDelay: '-10s' }} />
          <div className="sidebar-bubble absolute w-10 h-10 rounded-full bg-[#FF79C6]/[0.04] blur-xl" style={{ top: '25%', left: '75%', animationDuration: '15s', animationDelay: '-3s' }} />
          <div className="sidebar-bubble absolute w-16 h-16 rounded-full bg-[#adc6ff]/[0.03] blur-2xl" style={{ top: '85%', left: '50%', animationDuration: '20s', animationDelay: '-8s' }} />
        </div>

        {/* ── Film strip perforation strip ── */}
        <div
          className="w-full h-[14px] shrink-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 4px,
              #4f46e5 4px,
              #4f46e5 14px,
              transparent 14px,
              transparent 18px
            )`,
            backgroundSize: "18px 10px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            opacity: 0.75,
          }}
        />

        {/* ── Logo / Header ── */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-white/[0.06]">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[var(--color-accent-blue)] rounded-xl flex items-center justify-center">
                  <MIcon name="movie" className="text-white text-[20px]" filled />
                </div>
                <div>
                  <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-wider text-[var(--color-text-primary)]">
                    CINEFORGE
                  </span>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-semibold">
                    Production Suite
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle — desktop */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileMenuOpen(false);
              } else {
                toggleSidebar();
              }
            }}
            className="hidden lg:flex ml-auto h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.span
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center"
            >
              <MIcon name="chevron_left" className="text-[20px]" />
            </motion.span>
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden ml-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
            aria-label="Close menu"
          >
            <MIcon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto relative z-10">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-all duration-[var(--duration-fast)]",
                  isActive
                    ? "bg-[#14162a] text-[var(--color-accent-blue)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[#10111c] hover:text-[var(--color-text-primary)]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--color-accent-blue)]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <MIcon
                  name={item.msIcon}
                  filled={isActive}
                  className={cn(
                    "transition-colors text-[22px]",
                    isActive ? "text-[var(--color-accent-blue)]" : ""
                  )}
                />
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

                {/* Tooltip — visible only when sidebar is collapsed */}
                {sidebarCollapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-primary)] opacity-0 scale-95 origin-left transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 shadow-[0_4px_16px_rgba(0,0,0,0.4)] z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User */}
        <div className="border-t border-[var(--color-border-subtle)] px-2 py-4">
          <div className="flex items-center gap-3 px-3 relative group">
            {activeUser.image ? (
              <img 
                src={activeUser.image} 
                alt={activeUser.name} 
                className="h-9 w-9 rounded-full object-cover" 
              />
            ) : (
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase bg-[var(--color-accent-blue)]"
              >
                {activeUser.name?.[0] || "?"}
              </div>
            )}
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {activeUser.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {activeUser.role
                      ? activeUser.role.replace(/_/g, " ")
                      : activeUser.email || "No Email"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!sidebarCollapsed && (
              <button
                onClick={handleSignOut}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-[var(--color-text-muted)] hover:text-red-400"
                aria-label="Sign out"
              >
                <MIcon name="logout" className="text-[18px]" />
              </button>
            )}

            {/* Tooltip for logout when collapsed */}
            {sidebarCollapsed && (
              <button
                onClick={handleSignOut}
                className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] px-3 py-1.5 text-xs font-medium text-red-500 opacity-0 scale-90 origin-left transition-all duration-150 ease-[var(--ease-spring)] group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto shadow-[var(--shadow-md)] z-50 flex items-center gap-2"
              >
                <MIcon name="logout" className="text-[16px]" />
                Sign out
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
