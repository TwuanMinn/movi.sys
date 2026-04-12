"use client";

import { motion } from "framer-motion";

/**
 * @frontend-specialist: SVG beam effect for dashboard hero.
 * Animated path with gradient mask — pure CSS/SVG,
 * no heavy canvas rendering.
 */

export function BeamEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      <svg
        className="absolute left-0 top-0 h-full w-full"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.18 30)" stopOpacity="0" />
            <stop
              offset="50%"
              stopColor="oklch(0.65 0.18 30)"
              stopOpacity="0.6"
            />
            <stop
              offset="100%"
              stopColor="oklch(0.65 0.18 30)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <motion.line
          x1="-200"
          y1="200"
          x2="1400"
          y2="200"
          stroke="url(#beam-gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.line
          x1="-200"
          y1="100"
          x2="1400"
          y2="300"
          stroke="url(#beam-gradient)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.line
          x1="-200"
          y1="300"
          x2="1400"
          y2="100"
          stroke="url(#beam-gradient)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
        />
      </svg>
    </div>
  );
}
