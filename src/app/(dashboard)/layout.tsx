"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUIStore } from "@/stores/ui-store";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

/**
 * @frontend-specialist: Dashboard layout group — sidebar + content.
 * Children render inside the main content area.
 * Sidebar is fixed on desktop, off-canvas on mobile.
 */

const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  movies: "Movies",
  team: "Team",
  assets: "Assets",
  calendar: "Calendar",
  analytics: "Analytics",
  promotion: "Promotion",
  announcements: "Announcements",
  reports: "Reports",
  settings: "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, hydrate } = useUIStore();
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).pop() ?? "";
  const pageLabel = BREADCRUMB_MAP[segment] ?? segment;

  // Hydrate localStorage preferences on client mount
  useEffect(() => { hydrate(); }, [hydrate]);

  return (
    <div className="relative min-h-screen">
      <Sidebar />

      <main
        className="min-h-screen transition-[margin] duration-[var(--duration-normal)] ml-0"
      >
        <style>{`
          @media (min-width: 1024px) {
            .dashboard-main {
              margin-left: ${sidebarCollapsed ? 80 : 288}px !important;
            }
          }
        `}</style>
        <div className="dashboard-main flex flex-col min-h-screen transition-[margin] duration-[var(--duration-normal)]">
          <Header />

          {/* Cinematic page transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              className="flex-1 flex flex-col relative"
            >
              {/* Scene title overlay — flashes the page name on enter */}
              <motion.div
                className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              >
                <motion.span
                  initial={{ opacity: 0.6, scale: 0.9, y: 5 }}
                  animate={{ opacity: 0, scale: 1, y: -5 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="font-[family-name:var(--font-display)] text-2xl md:text-4xl font-bold text-[var(--color-text-primary)] tracking-widest uppercase select-none"
                >
                  {pageLabel}
                </motion.span>
              </motion.div>

              {/* Page content — slides up with blur */}
              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                  filter: { duration: 0.25 },
                }}
                className="flex-1 flex flex-col"
              >
                {children}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

