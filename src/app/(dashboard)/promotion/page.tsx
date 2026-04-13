"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useStudioStore } from "@/stores/studio-store";
import { PROMO_STEPS, ROLES } from "@/lib/studio-data";
import { PHASE_COLOR } from "@/lib/studio-styles";
import { AnimatedCounter } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/effects/spotlight-card";

function MI({ name, className = "", filled, style }: { name: string; className?: string; filled?: boolean; style?: React.CSSProperties }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`, ...style }}
    >
      {name}
    </span>
  );
}

/* ── Glassmorphism card matching dashboard ── */
const glassCard: React.CSSProperties = {
  background: "rgba(31, 35, 45, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(173, 198, 255, 0.1)",
  borderLeft: "1px solid rgba(173, 198, 255, 0.1)",
  borderRight: "1px solid rgba(173, 198, 255, 0.04)",
  borderBottom: "1px solid rgba(173, 198, 255, 0.04)",
  borderRadius: 16,
};

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;

/* ── Animation variants ── */
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: STANDARD_EASE },
  },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, x: -14, y: 10 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
};

/* ── SVG Progress Ring ── */
function ProgressRing({ percent, size = 100, strokeWidth = 6, color = "var(--color-accent-blue)" }: {
  percent: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(173,198,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-[family-name:var(--font-display)] font-extrabold text-[var(--color-text-primary)]">
          <AnimatedCounter value={`${percent}%`} duration={1200} />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">Complete</span>
      </div>
    </div>
  );
}

/* ── Phase badge component ── */
function PhaseBadge({ phase }: { phase: string }) {
  const color = PHASE_COLOR[phase] || "#8b90a0";
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest"
      style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}
    >
      {phase}
    </span>
  );
}

export default function PromotionPage() {
  const store = useStudioStore();
  const { movies, users, taskChecked, taskAssignments } = store;
  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id ?? 0);
  const promoMovie = movies.find(m => m.id === selectedMovieId) ?? movies[0]!;

  const completionPct = Math.round((promoMovie.promoStep / 9) * 100);
  const completedSteps = PROMO_STEPS.filter(s => s.id < promoMovie.promoStep).length;
  const currentStep = PROMO_STEPS.find(s => s.id === promoMovie.promoStep);
  const totalTasks = PROMO_STEPS.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasks = PROMO_STEPS.filter(s => s.id < promoMovie.promoStep).reduce((sum, s) => sum + s.tasks.length, 0);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col gap-8"
    >
      {/* ── Hero Banner ── */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-2xl overflow-hidden film-grain"
        style={{
          background: "linear-gradient(135deg, rgba(75,142,255,0.08) 0%, rgba(31,35,45,0.9) 40%, rgba(25,28,34,0.95) 100%)",
          border: "1px solid rgba(173,198,255,0.08)",
        }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #4b8eff, transparent 70%)" }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #ffb595, transparent 70%)" }} />

        <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-accent-blue)]">
                Campaign Active
              </span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl lg:text-4xl font-[family-name:var(--font-display)] font-extrabold tracking-tight text-[var(--color-text-primary)]"
            >
              Promotion Tracker
            </motion.h2>
            <p className="text-[var(--color-text-muted)] text-sm font-medium max-w-md">
              Orchestrate campaign milestones from pre-launch research through global premiere and post-release analytics.
            </p>
          </div>

          {/* Project Selector Tabs */}
          <div className="flex bg-[var(--color-bg-surface)]/80 rounded-2xl p-1.5 shadow-md border border-[var(--color-border-default)]/20 w-full md:w-auto overflow-x-auto backdrop-blur-sm">
            {movies.slice(0, 3).map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMovieId(m.id); store.setPromoMovie(m); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  promoMovie.id === m.id
                    ? "bg-[var(--color-bg-elevated)] text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/20 shadow-lg shadow-[var(--color-accent-blue)]/10"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/40"
                }`}
              >
                <span className="text-base">{m.poster}</span>
                {m.title}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── KPI Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Main Status Card */}
        <motion.div
          variants={fadeUp}
          className="md:col-span-5"
          style={glassCard}
        >
          <div className="p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6">
            <ProgressRing percent={completionPct} size={110} strokeWidth={7} />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                {promoMovie.title}
              </h3>
              <p className="text-[var(--color-text-muted)] text-xs font-medium mt-1">
                Campaign Launch: <span className="text-[var(--color-text-secondary)]">{promoMovie.releaseDate}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <PhaseBadge phase={currentStep?.phase || "Pre-Production"} />
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-default)]/20">
                  Step {promoMovie.promoStep}/9
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Phases Complete",
              value: `${completedSteps}/9`,
              icon: "verified",
              accent: "var(--color-accent-blue)",
              bg: "rgba(75,142,255,0.06)",
            },
            {
              label: "Tasks Cleared",
              value: `${completedTasks}/${totalTasks}`,
              icon: "task_alt",
              accent: "#82dab0",
              bg: "rgba(130,218,176,0.06)",
            },
            {
              label: "Team Capacity",
              value: "88%",
              icon: "bolt",
              accent: "#ffb595",
              bg: "rgba(255,181,149,0.06)",
            },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={fadeSlide}
              whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-5 border border-[var(--color-border-default)]/20 relative overflow-hidden"
              style={{ ...glassCard, background: kpi.bg }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-2" style={{ color: kpi.accent }}>
                    {kpi.label}
                  </p>
                  <h4 className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] tracking-tight">
                    <AnimatedCounter value={kpi.value} duration={1000} />
                  </h4>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${kpi.accent}15` }}
                >
                  <MI name={kpi.icon} className="!text-xl" filled style={{ color: kpi.accent }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Campaign Progress Bar ── */}
      <motion.div variants={fadeUp} className="px-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Pre-Launch</span>
          <span className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">Global Premiere</span>
        </div>
        <div className="w-full bg-[var(--color-bg-elevated)] h-2 rounded-full overflow-hidden border border-[var(--color-border-default)]/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
            className="h-full rounded-full relative"
            style={{
              background: "linear-gradient(90deg, #4b8eff 0%, #82dab0 50%, #ffb595 100%)",
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-[var(--color-accent-blue)]/30 border-2 border-[var(--color-accent-blue)]" />
          </motion.div>
        </div>
        {/* Phase markers */}
        <div className="flex justify-between mt-2">
          {["Pre-Production", "Production", "Post-Production", "Marketing", "Release"].map((phase) => (
            <span key={phase} className="text-[9px] font-bold" style={{ color: PHASE_COLOR[phase] || "#8b90a0" }}>
              {phase.replace("Pre-Production", "Pre-Prod").replace("Post-Production", "Post-Prod")}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Vertical Timeline / Stepper ── */}
      <div className="relative pt-2 pb-12">
        {/* Gradient vertical line */}
        <div
          className="absolute left-[39px] top-6 bottom-0 w-[2px] hidden md:block"
          style={{
            background: "linear-gradient(180deg, rgba(75,142,255,0.3), rgba(130,218,176,0.2), rgba(255,181,149,0.15), rgba(65,71,85,0.1))",
          }}
        />

        <div className="space-y-5">
          {PROMO_STEPS.map((step, idx) => {
            const isComplete = step.id < promoMovie.promoStep;
            const isCurrent = step.id === promoMovie.promoStep;
            const isFuture = step.id > promoMovie.promoStep;
            const phaseColor = PHASE_COLOR[step.phase] || "#8b90a0";

            return (
              <motion.div
                key={step.id}
                variants={fadeSlide}
                className={`relative pl-0 md:pl-28 group ${isFuture ? "opacity-50" : ""}`}
              >
                {/* Node Dot — phase-colored */}
                <div className="absolute left-[40px] top-10 hidden md:block z-10 -translate-x-[50%] -translate-y-[50%]">
                  <div
                    className={`w-[28px] h-[28px] rounded-full ring-[8px] ${
                      isCurrent ? "ring-[var(--color-bg-primary)]" : "ring-[var(--color-bg-primary)]"
                    }`}
                    style={{
                      backgroundColor: isComplete || isCurrent ? phaseColor : "var(--color-border-default)",
                      boxShadow: isCurrent ? `0 0 16px ${phaseColor}40, 0 0 32px ${phaseColor}15` : "none",
                    }}
                  />
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid ${phaseColor}` }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* Step Card */}
                <SpotlightCard
                  className={`!rounded-[18px] transition-all overflow-hidden ${
                    isCurrent
                      ? "shadow-lg"
                      : isComplete
                      ? ""
                      : "opacity-90"
                  }`}
                >
                  <div
                    className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-4"
                    style={{
                      borderLeft: isCurrent ? `3px solid ${phaseColor}` : isComplete ? `3px solid ${phaseColor}40` : "3px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                          background: isCurrent
                            ? phaseColor
                            : isComplete
                            ? `${phaseColor}15`
                            : "var(--color-bg-elevated)",
                          color: isCurrent ? "white" : isComplete ? phaseColor : "var(--color-text-muted)",
                          boxShadow: isCurrent ? `0 4px 20px ${phaseColor}30` : "none",
                        }}
                      >
                        <span className="text-xl">{step.icon}</span>
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2.5 mb-0.5 flex-wrap">
                          <h4 className={`font-[family-name:var(--font-display)] font-bold text-[17px] ${
                            isCurrent || isComplete ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
                          }`}>
                            {step.title}
                          </h4>
                          <PhaseBadge phase={step.phase} />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className={`text-xs font-bold tracking-wide ${
                            isCurrent ? "" : "text-[var(--color-text-muted)]"
                          }`}
                            style={{ color: isCurrent ? phaseColor : undefined }}
                          >
                            Phase 0{step.id} • {
                              isComplete ? "Completed" :
                              isCurrent ? `In Progress (${step.tasks.filter((_,j) => taskChecked[promoMovie.id + "-" + step.id + "-" + j]).length}/${step.tasks.length} Tasks)` :
                              "Upcoming"
                            }
                          </p>
                          <span className="text-[10px] font-bold text-[var(--color-text-muted)]/60">
                            ⏱ {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end sm:justify-center">
                      {isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15, delay: idx * 0.05 }}
                        >
                          <MI name="check_circle" className="!text-[22px]" filled style={{ color: phaseColor }} />
                        </motion.div>
                      )}
                      {isCurrent && (
                        <motion.div
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="w-8 h-8 rounded-full hover:bg-[var(--color-bg-elevated)] flex items-center justify-center transition-colors"
                        >
                          <MI name="keyboard_arrow_up" className="text-[var(--color-text-muted)] !text-[20px]" />
                        </motion.div>
                      )}
                      {isFuture && <MI name="lock" className="text-[var(--color-text-muted)]/50 !text-[20px]" filled />}
                    </div>
                  </div>

                  {/* Checklist (Only visible if current) */}
                  <AnimatePresence>
                    {isCurrent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="border-t border-[var(--color-border-default)]/15"
                        style={{ background: "rgba(16,19,26,0.4)" }}
                      >
                        <div className="px-6 py-4 space-y-1">
                          {step.tasks.map((task, j) => {
                            const tk = `${promoMovie.id}-${step.id}-${j}`;
                            const checked = taskChecked[tk] || false;
                            const assignedUser = taskAssignments[tk];
                            const usr = users.find((u) => u.id === parseInt(assignedUser || "0"));

                            const isPendingApp = task.toLowerCase().includes("pending");
                            const isLegal = task.toLowerCase().includes("legal");
                            const subTextMsg = isPendingApp ? "Pending Legal Approval" :
                                               tk.includes("-1-") ? "Approved by Director" :
                                               checked ? "Completed" :
                                               "In progress";

                            return (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.05, duration: 0.25 }}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 group p-3 hover:bg-[var(--color-bg-elevated)]/50 rounded-xl transition-all"
                              >
                                <div className="flex items-start sm:items-center gap-4 flex-1">
                                  {/* Checkbox */}
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => store.toggleTask(step.id, j, task)}
                                    className={`mt-1 sm:mt-0 flex-shrink-0 w-[22px] h-[22px] rounded-md flex items-center justify-center transition-all ${
                                      checked
                                        ? ""
                                        : "bg-transparent border-[1.5px] border-[var(--color-text-muted)]/30 hover:border-[var(--color-accent-blue)]"
                                    }`}
                                    style={{
                                      backgroundColor: checked ? phaseColor : undefined,
                                      boxShadow: checked ? `0 2px 8px ${phaseColor}30` : undefined
                                    }}
                                  >
                                    {checked && <MI name="check" className="!text-[14px] text-white" style={{ strokeWidth: 4 }} />}
                                  </motion.button>

                                  {/* Label */}
                                  <div className="flex-1">
                                    <h5 className={`text-[13px] font-bold tracking-wide transition-colors ${
                                      checked ? "text-[var(--color-text-secondary)] line-through opacity-60" : "text-[var(--color-text-primary)]"
                                    }`}>
                                      {task}
                                    </h5>
                                    <p className={`text-[11px] font-semibold mt-0.5 ${
                                      isLegal || isPendingApp ? "text-[#e85d75]" : "text-[var(--color-text-muted)]"
                                    }`}>
                                      {subTextMsg}
                                    </p>
                                  </div>
                                </div>

                                {/* Assignment Chip */}
                                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 mt-2 sm:mt-0">
                                  {usr ? (
                                    <button className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--color-bg-surface)] rounded-full border border-[var(--color-border-default)]/60 hover:border-[var(--color-accent-blue)]/50 transition-colors shadow-sm">
                                      <Image
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(usr.name)}&backgroundColor=${ROLES.find((r) => r.id === usr.role)?.color?.replace("#", "") || "transparent"}`}
                                        alt={`${usr.name} avatar`}
                                        width={20}
                                        height={20}
                                        unoptimized
                                        className="w-5 h-5 rounded-full bg-[var(--color-bg-elevated)]"
                                      />
                                      <span className="text-[11px] font-bold text-[var(--color-text-primary)] pr-1">{usr.name.split(" ")[0]}</span>
                                      <MI name="keyboard_arrow_down" className="!text-[14px] text-[var(--color-text-muted)]" />
                                    </button>
                                  ) : (
                                    <motion.div
                                      whileHover={{ scale: 1.03, borderColor: "rgba(75,142,255,0.3)" }}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-surface)] rounded-full border border-[var(--color-border-default)]/60 hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer text-[11px] font-bold text-[var(--color-text-muted)]"
                                    >
                                      <MI name="person_add" className="!text-[14px]" />
                                      <span>Assign</span>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Floating Action Button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-8 right-8 w-[56px] h-[56px] rounded-full bg-[var(--color-accent-blue)] text-white shadow-lg flex items-center justify-center group z-50"
        style={{
          boxShadow: "0 4px 20px rgba(75,142,255,0.35), 0 0 40px rgba(75,142,255,0.1)",
        }}
      >
        <MI name="add" className="!text-[28px]" />
        <span className="absolute right-full mr-4 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[var(--color-border-default)]/30 shadow-lg">
          Add Task
        </span>
      </motion.button>
    </motion.div>
  );
}
