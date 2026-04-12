"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUIStore } from "@/stores/ui-store";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * @frontend-specialist: Dashboard layout group — sidebar + content.
 * Children render inside the main content area.
 * Sidebar is fixed on desktop, off-canvas on mobile.
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useUIStore();
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      {/* Main content area
        - Mobile (<lg): no left margin (sidebar is overlay)
        - Desktop (≥lg): left margin matches sidebar width (240px / 64px collapsed) */}
      <main
        className="min-h-screen transition-[margin] duration-[var(--duration-normal)] ml-0"
        style={{
          marginLeft: undefined, // overridden by the className for mobile
        }}
      >
        {/* Apply desktop margin with a responsive <style> block */}
        <style>{`
          @media (min-width: 1024px) {
            .dashboard-main {
              margin-left: ${sidebarCollapsed ? 64 : 240}px !important;
            }
          }
        `}</style>
        <div className="dashboard-main flex flex-col min-h-screen transition-[margin] duration-[var(--duration-normal)]">
          <Header />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1], // ease-out
              }}
              className="flex-1 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
