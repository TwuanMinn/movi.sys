"use client";

import { useStudioStore } from "@/stores/studio-store";
import { AnimatedCounter, RippleButton } from "@/components/ui/motion-primitives";
import { ModalBox } from "@/components/ui/modal-box";
import { S, STATUS_COLOR } from "@/lib/studio-styles";
import { GENRES, STATUSES, POSTER_OPTIONS } from "@/lib/studio-data";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const STATUS_LIST = ["Pre-Production", "In Production", "Post-Production", "Released"];

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Glass-card style extracted from Stitch design */
const glassCard: React.CSSProperties = {
  background: "rgba(31, 35, 45, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(173, 198, 255, 0.1)",
  borderLeft: "1px solid rgba(173, 198, 255, 0.1)",
  borderRight: "1px solid rgba(173, 198, 255, 0.04)",
  borderBottom: "1px solid rgba(173, 198, 255, 0.04)",
  borderRadius: 12,
};

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;

/** Stagger container variants */
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export default function DashboardPage() {
  const store = useStudioStore();
  const filteredMovies = store.filteredMovies();
  const totalBudget = store.totalBudget();
  const totalSpent = store.totalSpent();
  const totalRevenue = store.totalRevenue();
  const releasedMovies = store.releasedMovies();
  const avgRating = store.avgRating();
  const activeProjects = store.movies.filter(m => m.status !== "Released").length;

  // Top 2 featured films for the portfolio cards
  const featuredFilms = store.movies.slice(0, 2);

  return (
    <>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8"
      >
        {/* ── Hero Header ── */}
        <motion.header variants={fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.8rem] font-bold tracking-tight text-[var(--color-text-primary)]">
              Executive Overview
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Monitoring the pulse of nocturnal high-fidelity cinema productions.
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-accent-primary)] font-bold">System Status</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-sm text-[var(--color-text-primary)]">Operational</p>
            </div>
            <div className="w-px h-10 bg-[var(--color-border-default)]" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Active Feeds</p>
              <p className="font-[family-name:var(--font-display)] font-bold text-sm text-[var(--color-text-primary)]">{activeProjects} Active</p>
            </div>
          </div>
        </motion.header>

        {/* ── Executive Metrics Grid ── */}
        <motion.section variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Total Budget Card */}
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            transition={{ duration: 0.2 }}
            style={glassCard}
            className="p-6 lg:p-8 relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 opacity-[0.06] text-5xl">💰</div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">Total Managed Budget</p>
            <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
              <AnimatedCounter value={`$${totalBudget}M`} duration={1.4} />
            </h3>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[var(--color-accent-primary)] text-sm font-bold">
                ${totalSpent}M spent
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                ({totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% utilized)
              </span>
            </div>
            <div className="mt-3 w-full h-1 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                className="h-full bg-[var(--color-accent-primary)] rounded-full"
              />
            </div>
          </motion.div>

          {/* Revenue Card */}
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            transition={{ duration: 0.2 }}
            style={glassCard}
            className="p-6 lg:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">Projected Revenue</p>
            <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-blue)]">
              <AnimatedCounter value={`$${totalRevenue}M`} duration={1.4} />
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {store.movies.slice(0, 3).map((m) => (
                  <div key={m.id} className="w-6 h-6 rounded-full border border-[var(--color-bg-primary)] bg-[var(--color-bg-elevated)] flex items-center justify-center text-[10px]">
                    {m.poster}
                  </div>
                ))}
              </div>
              <span className="text-[var(--color-text-muted)] text-xs">
                {totalSpent > 0 ? `${((totalRevenue / totalSpent) * 100).toFixed(0)}% ROI` : "Awaiting release data"}
              </span>
            </div>
            <div className="mt-3 w-full h-1 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalRevenue > 0 ? Math.min((totalRevenue / (totalBudget * 3)) * 100, 100) : 0}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
                className="h-full bg-[var(--color-accent-blue)] rounded-full"
              />
            </div>
          </motion.div>

          {/* Active Projects Card */}
          <motion.div
            whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            transition={{ duration: 0.2 }}
            style={{
              ...glassCard,
              background: "linear-gradient(135deg, rgba(212,83,75,0.08) 0%, rgba(31,35,45,0.6) 100%)",
            }}
            className="p-6 lg:p-8 sm:col-span-2 lg:col-span-1"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)] mb-2 font-bold">Active Productions</p>
            <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
              <AnimatedCounter value={activeProjects} duration={1.0} />
            </h3>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
                <span className="text-xs text-[var(--color-text-secondary)]">{store.movies.length} total projects</span>
              </div>
              <span className="text-lg opacity-60">📡</span>
            </div>
            <div className="mt-3 w-full h-1 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${store.movies.length > 0 ? (activeProjects / store.movies.length) * 100 : 0}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                className="h-full bg-[var(--color-accent-primary)] rounded-full"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* ── Main Content: Portfolio + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Film Portfolio + Activity */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">

            {/* Film Portfolio */}
            <motion.section variants={fadeUp}>
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-xl lg:text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                  Prestige Portfolio
                </h3>
                <div className="flex gap-2 items-center">
                  <select
                    value={store.filterStatus}
                    onChange={e => store.setFilterStatus(e.target.value)}
                    className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-[var(--radius-sm)] px-2 py-1.5 focus:outline-none focus:border-[var(--color-accent-primary)]/50"
                  >
                    <option value="all">All Status</option>
                    {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <RippleButton onClick={() => store.setShowMovieModal(true)} style={S.btnP}>
                    + New Film
                  </RippleButton>
                </div>
              </div>

              {/* Featured film cards — cinematic style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {featuredFilms.map((movie, i) => {
                  const pct = movie.budget > 0 ? ((movie.spent / movie.budget) * 100).toFixed(0) : "0";
                  return (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.015 }}
                      onClick={() => store.setSelectedMovie(store.selectedMovie?.id === movie.id ? null : movie)}
                      className="group relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer"
                      style={glassCard}
                    >
                      {/* Gradient background based on genre */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-hover)] to-[var(--color-bg-primary)] opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                        <span className="text-8xl">{movie.poster}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent opacity-90" />

                      <div className="absolute bottom-0 left-0 p-5 lg:p-6 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded"
                            style={{
                              background: `${STATUS_COLOR[movie.status]}18`,
                              color: STATUS_COLOR[movie.status],
                            }}
                          >
                            {statusLabel(movie.status)}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
                            {movie.genre}
                          </span>
                        </div>
                        <h4 className="text-xl lg:text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-3">
                          {movie.title}
                        </h4>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 max-w-[180px] h-1.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(Number(pct), 100)}%` }}
                              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 + i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: STATUS_COLOR[movie.status] }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                            {pct}% Budget Used
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Film list — remaining movies */}
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {filteredMovies.slice(2).map((m, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      key={m.id}
                      onClick={() => store.setSelectedMovie(store.selectedMovie?.id === m.id ? null : m)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group"
                      style={{
                        background: store.selectedMovie?.id === m.id ? "rgba(173,198,255,0.06)" : "rgba(25,28,34,0.7)",
                        border: `1px solid ${store.selectedMovie?.id === m.id ? "rgba(173,198,255,0.15)" : "rgba(173,198,255,0.05)"}`,
                      }}
                    >
                      <span className="text-2xl">{m.poster}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-sm font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-primary)]">{m.title}</span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: `${STATUS_COLOR[m.status]}15`, color: STATUS_COLOR[m.status] }}
                          >
                            {statusLabel(m.status)}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{m.genre} · {m.releaseDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.revenue > 0 && (
                          <span className="text-xs text-[var(--color-accent-blue)] font-semibold">+${m.revenue}M</span>
                        )}
                        <span className="text-xs text-[var(--color-text-muted)]">${m.spent}M / ${m.budget}M</span>
                      </div>
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => store.setEditingMovie({ ...m })} className="text-[10px] px-2 py-1 rounded border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Edit</button>
                        <button onClick={() => store.handleDeleteMovie(m.id)} className="text-[10px] px-2 py-1 rounded border border-[var(--color-border-default)] text-[#D4534B] hover:bg-[rgba(212,83,75,0.1)] transition-colors">✕</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Activity Feed */}
            <motion.section variants={fadeUp}>
              <h3 className="text-xl lg:text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-4 lg:mb-6">
                Management Activity
              </h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {store.activities.slice(0, 6).map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      whileHover={{ backgroundColor: "var(--color-bg-hover)", x: 3 }}
                      className="flex gap-3 items-start p-3 rounded-lg transition-colors cursor-default"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                        style={{ background: "rgba(212,83,75,0.08)" }}
                      >
                        {a.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[var(--color-text-primary)]">
                          <strong className="text-[var(--color-text-secondary)]">{a.user}</strong>{" "}
                          {a.action}{" "}
                          <strong className="text-[var(--color-accent-primary)]">{a.target}</strong>
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 block">{a.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Collaboration Notes */}
            <motion.section variants={fadeUp} style={S.card}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 style={S.h3}>Collaboration Notes</h3>
                <select value={store.commentMovie} onChange={e => store.setCommentMovie(e.target.value)} style={{ ...S.input, width: "auto", padding: "6px 12px", fontSize: 13 }}>
                  {store.movies.map(m => <option key={m.id} value={m.title}>{m.poster} {m.title}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mb-4 flex-col sm:flex-row">
                <input value={store.newComment} onChange={e => store.setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && store.addComment()} placeholder="Add a note or feedback..." style={{ ...S.input, flex: 1 }} />
                <RippleButton onClick={store.addComment} style={S.btnP}>Post</RippleButton>
              </div>
              <div className="flex flex-col gap-3">
                {store.comments.filter(c => c.movie === store.commentMovie).map(c => (
                  <div key={c.id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(173,198,255,0.05)" }}>
                    <div className="flex justify-between mb-2">
                      <strong className="text-sm" style={{ color: "#c1c6d7" }}>{c.user}</strong>
                      <span className="text-[10px]" style={{ color: "#414755" }}>{c.time}</span>
                    </div>
                    <p className="text-sm mb-2 leading-relaxed" style={{ color: "#e1e2eb" }}>{c.text}</p>
                    {c.replies.map((r, ri) => (
                      <div key={ri} className="ml-4 pl-3 mb-1.5" style={{ borderLeft: "2px solid rgba(173,198,255,0.07)" }}>
                        <strong className="text-xs" style={{ color: "#c1c6d7" }}>{r.user}</strong>
                        <span className="text-[10px] ml-2" style={{ color: "#414755" }}>{r.time}</span>
                        <p className="text-xs mt-0.5" style={{ color: "#8b90a0" }}>{r.text}</p>
                      </div>
                    ))}
                    {store.showReply === c.id ? (
                      <div className="flex gap-2 mt-2 ml-4 flex-wrap">
                        <input value={store.replyText[c.id] ?? ""} onChange={e => store.setReplyText(p => ({ ...p, [c.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && store.addReply(c.id)} placeholder="Write a reply..." style={{ ...S.input, flex: 1, fontSize: 12, padding: "6px 10px", minWidth: 140 }} />
                        <button onClick={() => store.addReply(c.id)} style={{ ...S.btnP, padding: "6px 12px", fontSize: 12 }}>Reply</button>
                      </div>
                    ) : (
                      <button onClick={() => store.setShowReply(c.id)} className="mt-1.5 text-xs px-2 py-0.5" style={{ ...S.btnG, fontSize: 11 }}>↩ Reply</button>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column: Team + Milestones */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">

            {/* Active Team */}
            <motion.section variants={fadeUp} style={glassCard} className="p-5 lg:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">Active Team</h3>
                <span className="text-[10px] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] px-2 py-0.5 rounded-full font-bold">
                  {store.users.filter(u => u.active).length} Online
                </span>
              </div>
              <div className="space-y-4">
                {store.users.filter(u => u.active).slice(0, 5).map(user => {
                  return (
                    <div key={user.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] flex items-center justify-center text-xs font-bold text-[var(--color-text-primary)]">
                            {user.avatar}
                          </div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--color-accent-green)] border-2 border-[var(--color-bg-primary)] rounded-full" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user.name}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-tight">
                            {user.role.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.lastActive}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => store.setShowUserModal(true)}
                className="w-full mt-5 py-2.5 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] rounded-lg text-xs font-bold hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                Manage Team
              </button>
            </motion.section>

            {/* Upcoming Milestones */}
            <motion.section
              variants={fadeUp}
              style={{
                ...glassCard,
                borderLeft: "3px solid var(--color-accent-primary)",
              }}
              className="p-5 lg:p-6"
            >
              <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-4">
                Upcoming Milestones
              </h3>
              {store.movies.filter(m => m.status !== "Released").slice(0, 2).map(movie => {
                const budgetPct = movie.budget > 0 ? ((movie.spent / movie.budget) * 100).toFixed(0) : "0";
                return (
                  <div key={movie.id} className="p-3 bg-[var(--color-bg-surface)] rounded-lg mb-3 last:mb-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold text-[var(--color-accent-primary)] uppercase tracking-widest">
                        {movie.title}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">{movie.releaseDate}</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                      {statusLabel(movie.status)} • Step {movie.promoStep}/9
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${budgetPct}%` }}
                          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                          className="h-full bg-[var(--color-accent-primary)] rounded-full"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">{budgetPct}%</span>
                    </div>
                  </div>
                );
              })}
            </motion.section>

            {/* Quick Stats */}
            <motion.section variants={fadeUp} style={glassCard} className="p-5 lg:p-6">
              <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--color-text-muted)]">Avg. Rating</span>
                  <span className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-amber)]">
                    {avgRating}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--color-text-muted)]">Released Films</span>
                  <span className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-blue)]">
                    {releasedMovies.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--color-text-muted)]">Total Films</span>
                  <span className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                    {store.movies.length}
                  </span>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* ── Selected Movie Detail Panel ── */}
        <AnimatePresence>
          {store.selectedMovie && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="rounded-xl p-5 lg:p-6 overflow-hidden"
              style={{ background: "rgba(25,28,34,0.97)", border: "1px solid rgba(173,198,255,0.1)" }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{store.selectedMovie.poster}</span>
                  <div>
                    <h3 style={{ ...S.h3, fontSize: 20 }}>{store.selectedMovie.title}</h3>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {store.selectedMovie.genre} · ${store.selectedMovie.budget}M · Step {store.selectedMovie.promoStep}/9
                    </span>
                  </div>
                </div>
                <button onClick={() => store.setSelectedMovie(null)} style={S.btnG}>Close</button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div style={S.label}>Budget Used</div>
                  <span className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                    {((store.selectedMovie.spent / store.selectedMovie.budget) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">${store.selectedMovie.spent}M of ${store.selectedMovie.budget}M</span>
                </div>
                <div>
                  <div style={S.label}>Audience</div>
                  {Object.entries(store.selectedMovie.audience).map(([k, v], i) => (
                    <div key={k} className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] w-8" style={{ color: (["#4A90D9", "#D4534B", "#82dab0"] as string[])[i] }}>{k}</span>
                      <span className="text-xs text-[var(--color-text-primary)]">{v}%</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={S.label}>Revenue</div>
                  <span className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-blue)]">
                    ${store.selectedMovie.revenue}M
                  </span>
                </div>
                <div>
                  <div style={S.label}>Rating</div>
                  <span className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-amber)]">
                    {store.selectedMovie.rating > 0 ? store.selectedMovie.rating : "—"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Add Film Modal ── */}
      <ModalBox open={store.showMovieModal} onClose={() => store.setShowMovieModal(false)} title="New Film Project">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={S.label}>Poster</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(173,198,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, cursor: "pointer" }} onClick={() => store.setShowPosterPicker(p => !p)}>
                {store.newMovie.poster}
              </div>
              {store.showPosterPicker && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, background: "rgba(18,15,12,0.95)", border: "1px solid rgba(173,198,255,0.1)", borderRadius: 10, padding: 10 }}>
                  {POSTER_OPTIONS.map(p => (
                    <button key={p} onClick={() => { store.setNewMovie(m => ({ ...m, poster: p })); store.setShowPosterPicker(false); }} style={{ width: 32, height: 32, background: store.newMovie.poster === p ? "rgba(212,83,75,0.15)" : "transparent", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 18 }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label style={S.label}>Title</label>
            <input value={store.newMovie.title} onChange={e => store.setNewMovie(m => ({ ...m, title: e.target.value }))} placeholder="Film title..." style={S.input} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={S.label}>Genre</label>
              <select value={store.newMovie.genre} onChange={e => store.setNewMovie(m => ({ ...m, genre: e.target.value }))} style={S.input}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Status</label>
              <select value={store.newMovie.status} onChange={e => store.setNewMovie(m => ({ ...m, status: e.target.value }))} style={S.input}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={S.label}>Budget ($M)</label>
              <input type="number" value={store.newMovie.budget} onChange={e => store.setNewMovie(m => ({ ...m, budget: parseFloat(e.target.value) || 0 }))} style={S.input} />
            </div>
            <div>
              <label style={S.label}>Release Date</label>
              <input type="date" value={store.newMovie.releaseDate} onChange={e => store.setNewMovie(m => ({ ...m, releaseDate: e.target.value }))} style={S.input} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <RippleButton onClick={store.handleAddMovie} style={{ ...S.btnP, flex: 1 }}>Create Project</RippleButton>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => store.setShowMovieModal(false)} style={{ ...S.btnG, flex: 1 }}>Cancel</motion.button>
          </div>
        </div>
      </ModalBox>

      {/* ── Edit Film Modal ── */}
      <ModalBox open={!!store.editingMovie} onClose={() => store.setEditingMovie(null)} title="Edit Film">
        {store.editingMovie && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={S.label}>Title</label>
              <input value={store.editingMovie.title} onChange={e => store.setEditingMovie(m => m ? { ...m, title: e.target.value } : m)} style={S.input} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={S.label}>Status</label>
                <select value={store.editingMovie.status} onChange={e => store.setEditingMovie(m => m ? { ...m, status: e.target.value } : m)} style={S.input}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Budget ($M)</label>
                <input type="number" value={store.editingMovie.budget} onChange={e => store.setEditingMovie(m => m ? { ...m, budget: parseFloat(e.target.value) || 0 } : m)} style={S.input} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={S.label}>Spent ($M)</label>
                <input type="number" value={store.editingMovie.spent} onChange={e => store.setEditingMovie(m => m ? { ...m, spent: parseFloat(e.target.value) || 0 } : m)} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Revenue ($M)</label>
                <input type="number" value={store.editingMovie.revenue} onChange={e => store.setEditingMovie(m => m ? { ...m, revenue: parseFloat(e.target.value) || 0 } : m)} style={S.input} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={S.label}>Rating (0–10)</label>
                <input type="number" step="0.1" min="0" max="10" value={store.editingMovie.rating} onChange={e => store.setEditingMovie(m => m ? { ...m, rating: parseFloat(e.target.value) || 0 } : m)} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Release Date</label>
                <input type="date" value={store.editingMovie.releaseDate} onChange={e => store.setEditingMovie(m => m ? { ...m, releaseDate: e.target.value } : m)} style={S.input} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <RippleButton onClick={store.handleEditMovie} style={{ ...S.btnP, flex: 1 }}>Save Changes</RippleButton>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => store.setEditingMovie(null)} style={{ ...S.btnG, flex: 1 }}>Cancel</motion.button>
            </div>
          </div>
        )}
      </ModalBox>

      {/* ── Toast ── */}
      <AnimatePresence>
        {store.toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: "fixed", bottom: 24, right: 24, background: "rgba(25,28,34,0.97)", border: "1px solid rgba(212,83,75,0.3)", borderRadius: 10, padding: "12px 18px", color: "#e1e2eb", fontSize: 13, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: "calc(100vw - 48px)" }}
          >
            {store.toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
