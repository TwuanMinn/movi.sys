"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   #7 — AnimatedCounter: Smooth count-up for KPI values
   Extracts the numeric part from strings like "$150M" or "8.2"
   and animates from 0 to the target value using requestAnimationFrame.
   Falls back to the real value so DOM text is always correct for
   accessibility and testing.
   ═══════════════════════════════════════════════════════════════ */

export function AnimatedCounter({
  value,
  duration = 1200,
}: {
  value: string | number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const str = String(value);
  const match = str.match(/(-?\d+\.?\d*)/);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!match || !ref.current || hasAnimated.current) return;
    const numericPart = match[1];
    if (!numericPart) return;
    hasAnimated.current = true;

    const target = parseFloat(numericPart);
    const isFloat = !Number.isInteger(target);
    const beforeNum = str.slice(0, match.index);
    const afterNum = str.slice((match.index ?? 0) + match[0].length);
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      if (ref.current) {
        ref.current.textContent = `${beforeNum}${isFloat ? current.toFixed(1) : Math.round(current)}${afterNum}`;
      }
      if (progress < 1) requestAnimationFrame(tick);
      else if (ref.current) ref.current.textContent = str; // ensure exact final value
    }

    requestAnimationFrame(tick);
  }, [str, match, duration]);

  return <span ref={ref}>{value}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   #6 — RippleButton: Material-style radial ripple from click
   Wraps motion.button with an animated ripple effect.
   ═══════════════════════════════════════════════════════════════ */

interface RippleData {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function RippleButton({
  children,
  style,
  className,
  onClick,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}) {
  const [ripples, setRipples] = useState<RippleData[]>([]);
  const nextId = useRef(0);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    onClick?.(e);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{ ...style, position: "relative", overflow: "hidden" }}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      {...(props as Record<string, unknown>)}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.35, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            borderRadius: "50%",
            background: "rgba(173,198,255,0.12)",
            pointerEvents: "none",
          }}
        />
      ))}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   #3 — SkeletonBlock: Shimmer loading placeholder
   ═══════════════════════════════════════════════════════════════ */

export function SkeletonBlock({
  width = "100%",
  height = 20,
  radius = 6,
}: {
  width?: string | number;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      className="anim-shimmer"
      style={{
        width,
        height,
        borderRadius: radius,
        background: "rgba(173,198,255,0.04)",
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ padding: 20, borderRadius: 12, border: "1px solid rgba(173,198,255,0.05)", background: "rgba(25,28,34,0.9)", display: "flex", flexDirection: "column", gap: 12 }}>
      <SkeletonBlock width="40%" height={14} />
      <SkeletonBlock height={32} />
      <SkeletonBlock width="60%" height={12} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   #5 — Page entrance variant presets
   Each page can import its own unique entrance orchestration.
   ═══════════════════════════════════════════════════════════════ */

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;

type PageVariantGroup = {
  container: Variants;
  item: Variants;
};

const dashboardVariants: PageVariantGroup = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  },
};

const analyticsVariants: PageVariantGroup = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  },
  item: {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  },
};

const reportsVariants: PageVariantGroup = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, y: -15, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 22 },
    },
  },
};

const calendarVariants: PageVariantGroup = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, x: -30 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 18 },
    },
  },
};

const promotionVariants: PageVariantGroup = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, x: -14, y: 10 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 22 },
    },
  },
};

export const pageVariants = {
  // Default fade+slide (used by layout)
  default: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: STANDARD_EASE },
  },
  dashboard: dashboardVariants,
  analytics: analyticsVariants,
  reports: reportsVariants,
  calendar: calendarVariants,
  promotion: promotionVariants,
};
