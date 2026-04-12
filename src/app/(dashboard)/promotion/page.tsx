"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/stores/studio-store";
import { PROMO_STEPS, ROLES } from "@/lib/studio-data";
import { pageVariants } from "@/components/ui/motion-primitives";

const phaseColor: Record<string, string> = {
  "Pre-Production": "#D4903B",
  "Production": "#D4534B",
  "Post-Production": "#8E5BB5",
  "Marketing": "#4A90D9",
  "Release": "#3BA55C",
  "Post-Release": "#2BA5A5",
};

function MiniBar({ value, max, color, h = 6 }: { value: number; max: number; color: string; h?: number }) {
  return (
    <div style={{ width: "100%", height: h, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        style={{ height: "100%", background: color, borderRadius: 3 }} 
      />
    </div>
  );
}

const S = {
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(214,198,170,0.1)", borderRadius: 8, padding: "9px 12px", color: "#D6C6AA", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.25s, box-shadow 0.25s" },
  label: { color: "#7A7062", fontSize: 10, fontFamily: "'Nunito Sans', sans-serif", letterSpacing: 1.2, textTransform: "uppercase" as const, display: "block" as const, marginBottom: 6 },
};

export default function PromotionPage() {
  const store = useStudioStore();
  const { movies, users, taskChecked, taskAssignments } = store;
  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id ?? 0);
  const promoMovie = movies.find(m => m.id === selectedMovieId) ?? movies[0]!;

  return (
    <motion.div
      variants={pageVariants.promotion.container}
      initial="hidden"
      animate="show"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >

      {/* ── Film selector buttons ── */}
      <motion.div variants={pageVariants.promotion.item} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {movies.map(m => (
          <motion.button 
            key={m.id} 
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => { setSelectedMovieId(m.id); store.setPromoMovie(m); }} 
            style={{ background: promoMovie.id === m.id ? "rgba(214,198,170,0.1)" : "rgba(28,25,21,0.7)", border: `1px solid ${promoMovie.id === m.id ? "rgba(214,198,170,0.2)" : "rgba(214,198,170,0.05)"}`, color: "#D6C6AA", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}
          >
            {m.poster} {m.title}
          </motion.button>
        ))}
      </motion.div>

      {/* ── Progress bar ── */}
      <motion.div 
        variants={pageVariants.promotion.item}
        style={{ background: "rgba(28,25,21,0.7)", border: "1px solid rgba(214,198,170,0.05)", borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 14 }}
      >
        <motion.span 
          key={promoMovie.id}
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          style={{ fontSize: 26 }}
        >
          {promoMovie.poster}
        </motion.span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#D6C6AA", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600 }}>{promoMovie.title} — Promotion Progress</div>
          <MiniBar value={promoMovie.promoStep} max={9} color="#D4534B" h={8} />
          <span style={{ color: "#7A7062", fontSize: 10 }}>Step {promoMovie.promoStep} of 9</span>
        </div>
        <motion.div 
          key={`pct-${promoMovie.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          style={{ color: "#D6C6AA", fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
        >
          {((promoMovie.promoStep / 9) * 100).toFixed(0)}%
        </motion.div>
      </motion.div>

      {/* ── 9-step timeline ── */}
      <div style={{ position: "relative" }}>
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "rgba(214,198,170,0.05)", transformOrigin: "top" }} 
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={promoMovie.id}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
          >
            {PROMO_STEPS.map((step) => {
              const isComplete = step.id < promoMovie.promoStep;
              const isCurrent = step.id === promoMovie.promoStep;
              const isFuture = step.id > promoMovie.promoStep;
              return (
                <motion.div 
                  key={step.id} 
                  variants={{
                    hidden: { opacity: 0, x: -20, y: 8 },
                    show: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: { type: "spring", stiffness: 300, damping: 22 },
                    },
                  }}
                  style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "8px 0" }}
                >
                  {/* Step circle */}
                  <motion.div 
                    whileHover={!isFuture ? { scale: 1.15 } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isComplete ? "rgba(59,165,92,0.12)" : isCurrent ? `${phaseColor[step.phase]}15` : "rgba(255,255,255,0.02)", border: `2px solid ${isComplete ? "#3BA55C" : isCurrent ? phaseColor[step.phase] : "rgba(214,198,170,0.06)"}`, fontSize: 15, zIndex: 1, boxShadow: isCurrent ? `0 0 16px ${phaseColor[step.phase]}20` : "none" }}
                  >
                    {isComplete ? "✓" : step.icon}
                  </motion.div>

                  {/* Step card */}
                  <motion.div 
                    whileHover={!isFuture ? { borderColor: `${phaseColor[step.phase]}30`, x: 3 } : undefined}
                    transition={{ duration: 0.15 }}
                    style={{ flex: 1, background: isCurrent ? `${phaseColor[step.phase]}05` : "rgba(28,25,21,0.5)", border: `1px solid ${isCurrent ? `${phaseColor[step.phase]}20` : "rgba(214,198,170,0.03)"}`, borderRadius: 12, padding: "12px 14px", opacity: isFuture ? 0.35 : 1 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div>
                        <span style={{ background: `${phaseColor[step.phase]}12`, color: phaseColor[step.phase], fontSize: 8, padding: "2px 6px", borderRadius: 20, letterSpacing: .8, textTransform: "uppercase", marginRight: 6 }}>{step.phase}</span>
                        <span style={{ color: "#D6C6AA", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{step.title}</span>
                      </div>
                      <span style={{ color: "#5A5347", fontSize: 10 }}>{step.duration}</span>
                    </div>

                    {/* Task list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {step.tasks.map((task, j) => {
                        const tk = `${promoMovie.id}-${step.id}-${j}`;
                        const checked = taskChecked[tk] || isComplete;
                        const assignedUser = taskAssignments[tk];
                        const usr = users.find(u => u.id === parseInt(assignedUser));
                        return (
                          <motion.div 
                            key={j} 
                            whileHover={!isFuture ? { backgroundColor: "rgba(214,198,170,0.03)", x: 2 } : undefined}
                            transition={{ duration: 0.12 }}
                            style={{ display: "flex", alignItems: "center", gap: 7, padding: "3px 5px", borderRadius: 5, background: checked ? "rgba(59,165,92,0.05)" : "transparent" }}
                          >
                            <motion.button 
                              whileTap={!isFuture ? { scale: 0.8 } : undefined}
                              onClick={() => !isComplete && !isFuture && store.toggleTask(step.id, j, task)} 
                              style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${checked ? "#3BA55C" : "rgba(214,198,170,0.12)"}`, background: checked ? "rgba(59,165,92,0.18)" : "transparent", cursor: isFuture ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#3BA55C", fontSize: 9, flexShrink: 0 }}
                            >
                              {checked && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                  ✓
                                </motion.span>
                              )}
                            </motion.button>
                            <span style={{ flex: 1, color: checked ? "#3BA55C" : isCurrent ? "#D6C6AA" : "#5A5347", fontSize: 11, textDecoration: checked ? "line-through" : "none" }}>{task}</span>
                            {!isFuture && (
                              <select value={assignedUser || ""} onChange={e => store.assignTask(step.id, j, e.target.value, task)} style={{ ...S.input, width: "auto", padding: "1px 5px", fontSize: 9, minWidth: 80 }}>
                                <option value="">Assign</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name.split(" ")[0]}</option>)}
                              </select>
                            )}
                            {usr && <span style={{ fontSize: 9, background: `${ROLES.find(r => r.id === usr.role)?.color}12`, color: ROLES.find(r => r.id === usr.role)?.color, padding: "1px 5px", borderRadius: 8 }}>{usr.avatar}</span>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
