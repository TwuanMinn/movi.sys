"use client";

import { motion } from "framer-motion";
import { TextReveal } from "@/components/effects/text-reveal";
import { Badge } from "@/components/ui/badge";

/**
 * @frontend-specialist: Calendar page — horizontal timeline of movie milestones.
 * @product-manager: Shows all productions' key dates in one view.
 * Demo data used until DB connection is configured.
 */

type MovieStatus = "development" | "pre_production" | "production" | "post_production";

interface Milestone {
  id: string;
  label: string;
  date: string; // ISO date
  completed: boolean;
}

interface ProductionRow {
  id: string;
  title: string;
  status: MovieStatus;
  color: string;
  milestones: Milestone[];
}

// Timeline spans Apr–Dec 2026
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TIMELINE_START = new Date("2026-04-01").getTime();
const TIMELINE_END = new Date("2026-12-31").getTime();
const TIMELINE_RANGE = TIMELINE_END - TIMELINE_START;

function dateToPercent(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return Math.max(0, Math.min(100, ((t - TIMELINE_START) / TIMELINE_RANGE) * 100));
}

const PRODUCTIONS: ProductionRow[] = [
  {
    id: "1",
    title: "Crimson Meridian",
    status: "production",
    color: "var(--color-accent-primary)",
    milestones: [
      { id: "m1", label: "Principal Photography", date: "2026-04-10", completed: true },
      { id: "m2", label: "Picture Lock", date: "2026-06-20", completed: false },
      { id: "m3", label: "VFX Delivery", date: "2026-08-01", completed: false },
      { id: "m4", label: "Festival Premiere", date: "2026-10-15", completed: false },
    ],
  },
  {
    id: "2",
    title: "The Last Observatory",
    status: "post_production",
    color: "var(--color-accent-green)",
    milestones: [
      { id: "m5", label: "Color Grade Complete", date: "2026-04-25", completed: true },
      { id: "m6", label: "Sound Mix Final", date: "2026-05-18", completed: false },
      { id: "m7", label: "DCP Delivery", date: "2026-06-30", completed: false },
      { id: "m8", label: "Theatrical Release", date: "2026-07-24", completed: false },
    ],
  },
  {
    id: "3",
    title: "Whispers at Dawn",
    status: "pre_production",
    color: "var(--color-accent-amber)",
    milestones: [
      { id: "m9", label: "Script Lock", date: "2026-05-05", completed: false },
      { id: "m10", label: "Cast Announcements", date: "2026-06-10", completed: false },
      { id: "m11", label: "Principal Photography", date: "2026-08-15", completed: false },
      { id: "m12", label: "Wrap", date: "2026-11-01", completed: false },
    ],
  },
  {
    id: "4",
    title: "Iron Cascade",
    status: "development",
    color: "var(--color-accent-blue)",
    milestones: [
      { id: "m13", label: "Greenlight", date: "2026-06-01", completed: false },
      { id: "m14", label: "Director Attached", date: "2026-07-15", completed: false },
      { id: "m15", label: "Pre-Production Start", date: "2026-09-01", completed: false },
      { id: "m16", label: "Production Start", date: "2026-12-01", completed: false },
    ],
  },
];

const TODAY_PERCENT = dateToPercent(new Date().toISOString().split("T")[0]!);

export default function CalendarPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <TextReveal
          text="PRODUCTION TIMELINE"
          className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-widest text-[var(--color-text-primary)]"
          as="h1"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-[var(--color-text-secondary)]"
        >
          April — December 2026 · All active productions
        </motion.p>
      </div>

      {/* Timeline container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] overflow-x-auto"
      >
        {/* Month header */}
        <div className="flex border-b border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] min-w-[640px]">
          <div className="w-36 sm:w-44 lg:w-52 shrink-0 border-r border-[var(--color-border-subtle)] px-3 sm:px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              Production
            </span>
          </div>
          <div className="relative flex-1">
            <div className="flex">
              {MONTHS.map((m) => (
                <div
                  key={m}
                  className="flex-1 border-r border-[var(--color-border-subtle)] px-2 py-3 last:border-r-0"
                >
                  <span className="text-xs font-medium text-[var(--color-text-muted)]">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production rows */}
        {PRODUCTIONS.map((prod, rowIdx) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIdx * 0.08 + 0.5 }}
            className="flex border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-bg-elevated)] transition-colors duration-[var(--duration-fast)] min-w-[640px]"
          >
            {/* Title cell */}
            <div className="w-36 sm:w-44 lg:w-52 shrink-0 border-r border-[var(--color-border-subtle)] px-3 sm:px-4 py-4">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate" title={prod.title}>
                {prod.title}
              </p>
              <div className="mt-1.5">
                <Badge variant="status" status={prod.status}>
                  {prod.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              </div>
            </div>

            {/* Timeline track */}
            <div className="relative flex-1 py-4">
              {/* Grid lines */}
              <div className="absolute inset-0 flex pointer-events-none">
                {MONTHS.map((m) => (
                  <div
                    key={m}
                    className="flex-1 border-r border-[var(--color-border-subtle)] last:border-r-0"
                  />
                ))}
              </div>

              {/* Today indicator */}
              {TODAY_PERCENT > 0 && TODAY_PERCENT < 100 ? (
                <div
                  className="absolute top-0 bottom-0 w-px bg-[var(--color-accent-primary)]/40 z-10"
                  style={{ left: `${TODAY_PERCENT}%` }}
                />
              ) : null}

              {/* Span bar from first to last milestone */}
              {(() => {
                const dates = prod.milestones.map((m) => dateToPercent(m.date));
                const minP = Math.min(...dates);
                const maxP = Math.max(...dates);
                return (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-0.5 rounded-full opacity-30 z-0"
                    style={{
                      left: `${minP}%`,
                      width: `${maxP - minP}%`,
                      backgroundColor: prod.color,
                    }}
                  />
                );
              })()}

              {/* Milestones */}
              {prod.milestones.map((m, mIdx) => {
                const pct = dateToPercent(m.date);
                return (
                  <motion.div
                    key={m.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: rowIdx * 0.08 + mIdx * 0.05 + 0.7, type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute top-1/2 -translate-y-1/2 group z-20"
                    style={{ left: `${pct}%`, transform: `translateX(-50%) translateY(-50%)` }}
                  >
                    {/* Diamond marker */}
                    <div
                      className="h-3 w-3 rotate-45 border-2 transition-all duration-[var(--duration-fast)] group-hover:scale-150"
                      style={{
                        backgroundColor: m.completed ? prod.color : "transparent",
                        borderColor: prod.color,
                      }}
                    />

                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] z-30">
                      <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-3 py-2 shadow-[var(--shadow-md)] whitespace-nowrap">
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">{m.label}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{m.date}</p>
                        {m.completed ? (
                          <p className="text-xs text-[var(--color-accent-green)] mt-0.5">✓ Completed</p>
                        ) : (
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Upcoming</p>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-1 overflow-hidden">
                        <div className="h-2 w-2 rotate-45 -translate-y-1/2 border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] mx-auto" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6"
      >
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rotate-45 border-2 border-[var(--color-text-muted)] bg-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rotate-45 border-2 border-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-px bg-[var(--color-accent-primary)]/60" />
          <span className="text-xs text-[var(--color-text-muted)]">Today</span>
        </div>
      </motion.div>
    </div>
  );
}
