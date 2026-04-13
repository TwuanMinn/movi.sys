"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useStudioStore } from "@/stores/studio-store";
import { CALENDAR_EVENTS } from "@/lib/studio-data";

function MI({ name, className = "", filled, style }: { name: string; className?: string; filled?: boolean; style?: React.CSSProperties }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`, ...style }}
    >
      {name}
    </span>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EVENT_COLORS: Record<string, string> = {
  deadline: "#D4534B",
  launch: "#4b8eff",
  meeting: "#D4903B",
  event: "#8E5BB5",
  campaign: "#2BA5A5",
  release: "#82dab0",
};

const SHOOT_SCENES = [
  { time: "09:00 AM", type: "shooting", label: "Scene 14B: The Rooftop Chase", sub: "Unit A · Principal Photography · Terminal 4", accent: "var(--color-accent-blue)" },
  { time: "02:30 PM", type: "scouting", label: "Abandoned Rail Yard Survey", sub: "Location Team · Ep. 4 Climax · Industrial District", accent: "#ffb595" },
  { time: "05:00 PM", type: "meeting", label: "Dailies Review & Sign-off", sub: "Post-Production Suite · Edit Room 2", accent: "#8b90a0" },
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = lastDay.getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean; date: Date }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    cells.push({ day: d, inMonth: false, date: new Date(year, month - 1, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) });
  }
  while (cells.length < 35) {
    const d = cells.length - startWeekday - daysInMonth + 1;
    cells.push({ day: d, inMonth: false, date: new Date(year, month + 1, d) });
  }
  return cells;
}

function fmtDate(d: Date) {
  return d.toISOString().split("T")[0]!;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const { movies } = useStudioStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const todayStr = fmtDate(now);

  const cells = useMemo(() => getCalendarDays(year, month), [year, month]);

  const eventsMap = useMemo(() => {
    const map: Record<string, typeof CALENDAR_EVENTS> = {};
    for (const ev of CALENDAR_EVENTS) {
      (map[ev.date] ??= []).push(ev);
    }
    return map;
  }, []);

  const goMonth = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  // Shoot progress mock
  const completedScenes = 42;
  const totalScenes = 65;
  const shootPct = Math.round((completedScenes / totalScenes) * 100);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* ── Left: Calendar Grid ── */}
      <section className="xl:col-span-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]"
            >
              Production Calendar
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[var(--color-text-muted)] mt-1"
            >
              {MONTH_NAMES[month]} {year} · Project: {movies[0]?.title ?? "—"}
            </motion.p>
          </div>
          <div className="flex items-center gap-1 bg-[var(--color-bg-elevated)] rounded-xl p-1">
            <button onClick={() => goMonth(-1)} className="p-2 hover:bg-[var(--color-bg-surface)] rounded-lg transition-colors">
              <MI name="chevron_left" className="text-[var(--color-text-secondary)]" />
            </button>
            <span className="px-4 font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
              {MONTH_NAMES[month]?.slice(0, 3)}
            </span>
            <button onClick={() => goMonth(1)} className="p-2 hover:bg-[var(--color-bg-surface)] rounded-lg transition-colors">
              <MI name="chevron_right" className="text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-7 gap-px bg-[var(--color-border-default)]/10 rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-border-default)]/20"
        >
          {/* Day Headers */}
          {DAYS.map((d) => (
            <div key={d} className="bg-[var(--color-bg-elevated)] p-3 text-center text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              {d}
            </div>
          ))}

          {/* Day Cells */}
          {cells.map((cell, i) => {
            const dateStr = fmtDate(cell.date);
            const isToday = dateStr === todayStr;
            const dayEvents = eventsMap[dateStr] ?? [];
            return (
              <div
                key={i}
                className={`bg-[var(--color-bg-base)] p-2 min-h-[110px] relative group transition-colors hover:bg-[var(--color-bg-elevated)] ${
                  !cell.inMonth ? "opacity-20" : "font-bold"
                } ${isToday ? "!bg-[var(--color-accent-blue)]/5 ring-1 ring-inset ring-[var(--color-accent-blue)]/20" : ""}`}
              >
                <span className={`relative z-10 text-sm ${isToday ? "text-[var(--color-accent-blue)] font-black" : "text-[var(--color-text-primary)]"}`}>
                  {cell.day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {dayEvents.slice(0, 2).map((ev, j) => (
                      <div
                        key={j}
                        className="px-1.5 py-0.5 text-[9px] rounded font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{
                          background: `${EVENT_COLORS[ev.type] ?? "#8b90a0"}15`,
                          color: EVENT_COLORS[ev.type] ?? "#8b90a0",
                          borderLeft: `2px solid ${EVENT_COLORS[ev.type] ?? "#8b90a0"}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: EVENT_COLORS[ev.type] ?? "#8b90a0" }}
                        />
                        <span className="truncate">{ev.type}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[8px] text-[var(--color-text-muted)] pl-1">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Right: Sidebar ── */}
      <aside className="xl:col-span-4 space-y-6">
        {/* Shoot Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden bg-[var(--color-bg-surface)] p-6 rounded-2xl border border-[var(--color-border-default)]/30"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)]">Shoot Progress</h3>
              <span className="text-[var(--color-accent-blue)] font-black text-2xl">{shootPct}%</span>
            </div>
            <div className="w-full bg-[var(--color-bg-elevated)] h-3 rounded-full mb-5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${shootPct}%` }}
                transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="bg-gradient-to-r from-[var(--color-accent-blue)] to-[#4b8eff] h-full rounded-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest mb-1">Scenes Completed</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                  {completedScenes} <span className="text-sm text-[var(--color-text-muted)] font-normal">/ {totalScenes}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest mb-1">Days Remaining</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">18</p>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute -right-8 -bottom-8 opacity-[0.04]">
            <MI name="movie" className="!text-[120px]" />
          </div>
        </motion.div>

        {/* Today's Agenda */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <h3 className="font-[family-name:var(--font-display)] font-bold text-xl text-[var(--color-text-primary)] px-1">Today&apos;s Agenda</h3>
          {SHOOT_SCENES.map((scene, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="p-4 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-surface)] transition-colors rounded-xl cursor-pointer group"
              style={{ borderLeft: `4px solid ${scene.accent}` }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: scene.accent }}>
                  {scene.time} · {scene.type}
                </span>
                <MI name="more_vert" className="text-sm text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-1">{scene.label}</h4>
              <p className="text-xs text-[var(--color-text-muted)]">{scene.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-gradient-to-br from-[var(--color-accent-blue)] to-[#3a6fcc] p-6 rounded-2xl text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <MI name="auto_awesome" className="text-3xl mb-3 opacity-60" />
            <h3 className="text-xl font-[family-name:var(--font-display)] font-bold leading-tight mb-2">
              Timeline Optimization
            </h3>
            <p className="text-white/75 text-sm leading-relaxed">
              Our engine suggests shifting principal photography by 4 days to avoid local equipment conflicts.
            </p>
            <button className="w-full mt-5 py-2.5 bg-white text-[var(--color-accent-blue)] font-[family-name:var(--font-display)] font-bold rounded-xl shadow-xl hover:bg-white/90 transition-colors text-sm">
              Apply Smart Shift
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </motion.div>
      </aside>
    </div>
  );
}
