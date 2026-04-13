"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  /** "line" = text line, "circle" = avatar, "card" = full card, "bar" = progress bar */
  variant?: "line" | "circle" | "card" | "bar";
  /** Width — can be tailwind class or inline */
  width?: string;
  /** Height — can be tailwind class or inline */
  height?: string;
  /** How many skeleton lines to repeat */
  count?: number;
}

export function Skeleton({
  className,
  variant = "line",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const base =
    "animate-pulse bg-[var(--color-bg-elevated)] rounded-lg relative overflow-hidden";

  const shimmer =
    "after:absolute after:inset-0 after:translate-x-[-100%] after:animate-[shimmer_1.5s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent";

  const variants: Record<string, string> = {
    line: "h-3 w-full",
    circle: "rounded-full w-10 h-10",
    card: "h-32 w-full rounded-xl",
    bar: "h-1.5 w-full rounded-full",
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={cn(base, shimmer, variants[variant], className)}
          style={{
            width: width || undefined,
            height: height || undefined,
          }}
        />
      ))}
    </>
  );
}

/** Pre-built skeleton layouts */
export function SkeletonMetricCard() {
  return (
    <div className="p-6 lg:p-8 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] space-y-4">
      <Skeleton variant="line" className="w-32 h-2.5" />
      <Skeleton variant="line" className="w-48 h-8" />
      <div className="flex items-center gap-3 mt-2">
        <Skeleton variant="line" className="w-20 h-3" />
        <Skeleton variant="line" className="w-16 h-3" />
      </div>
      <Skeleton variant="bar" className="mt-2" />
    </div>
  );
}

export function SkeletonMovieRow() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="line" className="w-40 h-3.5" />
        <Skeleton variant="line" className="w-24 h-2.5" />
      </div>
      <Skeleton variant="line" className="w-16 h-3" />
    </div>
  );
}

export function SkeletonTeamRow() {
  return (
    <div className="flex items-center gap-3 py-2">
      <Skeleton variant="circle" className="w-9 h-9" />
      <div className="flex-1 space-y-1.5">
        <Skeleton variant="line" className="w-28 h-3" />
        <Skeleton variant="line" className="w-16 h-2" />
      </div>
    </div>
  );
}

export function SkeletonPageLoader() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="line" className="w-64 h-8" />
        <Skeleton variant="line" className="w-96 h-3" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>

      {/* Content rows */}
      <div className="space-y-3">
        <Skeleton variant="line" className="w-48 h-5 mb-4" />
        <SkeletonMovieRow />
        <SkeletonMovieRow />
        <SkeletonMovieRow />
        <SkeletonMovieRow />
      </div>
    </div>
  );
}
