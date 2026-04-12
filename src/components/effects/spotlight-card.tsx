"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * @frontend-specialist: Mouse-tracking radial gradient spotlight.
 * GPU-accelerated via transform/opacity only.
 * @performance-optimizer: Uses Framer Motion's optimized
 * useMotionValue to avoid React re-renders on mouse move.
 */

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SpotlightCard({ children, className, onClick }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x}px ${y}px, oklch(0.65 0.18 30 / 0.08), transparent 60%)`
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] transition-colors duration-[var(--duration-normal)]",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}
