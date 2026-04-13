"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useStudioStore } from "@/stores/studio-store";
import { STATUS_COLOR } from "@/lib/studio-styles";

const GENRE_ICONS: Record<string, string> = {
  Action: "💥",
  Drama: "🎭",
  "Sci-Fi": "🛸",
  Horror: "👻",
  Romance: "🌙",
  Comedy: "😂",
  Thriller: "🔪",
  Animation: "🎨",
  Documentary: "🌍",
};

const GENRE_GRADIENTS: Record<string, string> = {
  Action: "from-[oklch(0.35_0.15_20)] to-[oklch(0.15_0.05_30)]",
  Drama: "from-[oklch(0.30_0.10_245)] to-[oklch(0.12_0.05_250)]",
  "Sci-Fi": "from-[oklch(0.40_0.12_75)] to-[oklch(0.15_0.05_70)]",
  Horror: "from-[oklch(0.20_0.10_300)] to-[oklch(0.08_0.05_310)]",
  Romance: "from-[oklch(0.45_0.15_340)] to-[oklch(0.15_0.05_345)]",
  Comedy: "from-[oklch(0.45_0.15_50)] to-[oklch(0.15_0.05_45)]",
  Thriller: "from-[oklch(0.30_0.08_65)] to-[oklch(0.12_0.03_60)]",
  Animation: "from-[oklch(0.45_0.14_130)] to-[oklch(0.15_0.05_140)]",
  Documentary: "from-[oklch(0.35_0.10_155)] to-[oklch(0.12_0.05_160)]",
};

/** Glass card style from Stitch design */
const glassCard: React.CSSProperties = {
  background: "rgba(39, 42, 49, 0.4)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(173, 198, 255, 0.05)",
};

const STANDARD_EASE = [0.4, 0, 0.2, 1] as const;

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Stagger variants */
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
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

export default function MoviesPage() {
  const {
    movies,
    setShowMovieModal,
    setEditingMovie,
    handleDeleteMovie,
    selectedMovie,
    setSelectedMovie,
    totalRevenue,
    totalSpent,
  } = useStudioStore();

  // Feature the first movie (largest budget) in a hero card
  const featured = movies[0];
  const remaining = movies.slice(1);
  const secondaryMovie = remaining[0] ?? null;

  // Compute aggregate stats
  const revenue = totalRevenue();
  const spent = totalSpent();
  const activeCount = movies.filter(m => m.status !== "Released").length;
  const avgROI = spent > 0 ? (revenue / spent).toFixed(1) : "—";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8"
    >
      {/* ── Editorial Header ── */}
      <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.8rem] font-bold tracking-tight text-[var(--color-accent-primary)]">
            Cinematic Assets
          </h2>
          <p className="mt-2 text-sm lg:text-base text-[var(--color-text-secondary)] leading-relaxed">
            A curated overview of our current active narratives. From initial sequence rendering to final color grading and distribution cycles.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMovieModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition-shadow hover:shadow-[var(--shadow-glow)]"
          >
            <span>+</span> New Production
          </motion.button>
        </div>
      </motion.div>

      {/* ── Asymmetric Bento Grid ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">

        {/* Featured Card — Hero (spanning 8 cols) */}
        {featured && (
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedMovie(selectedMovie?.id === featured.id ? null : featured)}
            className="md:col-span-8 group relative overflow-hidden rounded-xl cursor-pointer"
            style={{
              ...glassCard,
              borderLeft: `3px solid ${STATUS_COLOR[featured.status] ?? "var(--color-accent-primary)"}`,
              boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Background poster + gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${GENRE_GRADIENTS[featured.genre] ?? GENRE_GRADIENTS.Action} opacity-40 group-hover:opacity-50 transition-opacity duration-500`} />
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-15 transition-opacity duration-700 group-hover:scale-110">
                <span className="text-[12rem]">{featured.poster}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/60 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-end min-h-[260px] lg:min-h-[320px]">
              <div className="flex gap-2 mb-3 flex-wrap">
                <span
                  className="px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded-full"
                  style={{
                    background: `${STATUS_COLOR[featured.status]}20`,
                    color: STATUS_COLOR[featured.status],
                    border: `1px solid ${STATUS_COLOR[featured.status]}30`,
                  }}
                >
                  {statusLabel(featured.status)}
                </span>
                <span className="px-3 py-0.5 bg-[var(--color-bg-elevated)]/60 text-[var(--color-text-secondary)] text-[10px] uppercase tracking-widest font-bold rounded-full">
                  {featured.genre}
                </span>
              </div>

              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4 lg:mb-6">
                {featured.title}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 border-t border-[var(--color-border-default)]/20 pt-4 lg:pt-5">
                <div>
                  <p className="text-[9px] uppercase text-[var(--color-text-muted)] font-bold mb-1 tracking-wider">Budget</p>
                  <p className="text-lg lg:text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">${featured.budget}M</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-[var(--color-text-muted)] font-bold mb-1 tracking-wider">Spent</p>
                  <p className="text-lg lg:text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-amber)]">${featured.spent}M</p>
                </div>
                {featured.revenue > 0 && (
                  <div>
                    <p className="text-[9px] uppercase text-[var(--color-text-muted)] font-bold mb-1 tracking-wider">Revenue</p>
                    <p className="text-lg lg:text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-blue)]">${featured.revenue}M</p>
                  </div>
                )}
                <div className="flex items-center justify-end col-span-full md:col-span-1">
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setEditingMovie({ ...featured })}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Side Card — second film (spanning 4 cols) */}
        {secondaryMovie && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            whileHover={{ borderColor: "rgba(173, 198, 255, 0.15)" }}
            onClick={() => setSelectedMovie(selectedMovie?.id === secondaryMovie.id ? null : secondaryMovie)}
            className="md:col-span-4 group rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)]/30 p-5 flex flex-col cursor-pointer hover:bg-[var(--color-bg-hover)] transition-all duration-300"
          >
            {/* Poster area */}
            <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gradient-to-br ${GENRE_GRADIENTS[secondaryMovie.genre] ?? GENRE_GRADIENTS.Action} flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500`}>
              <span className="text-6xl opacity-60 group-hover:opacity-80 transition-opacity">{secondaryMovie.poster}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <span
                  className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded"
                  style={{
                    background: `${STATUS_COLOR[secondaryMovie.status]}18`,
                    color: STATUS_COLOR[secondaryMovie.status],
                  }}
                >
                  {statusLabel(secondaryMovie.status)}
                </span>
                <span className="text-[var(--color-text-muted)] text-xs font-semibold">{secondaryMovie.genre}</span>
              </div>
              <h4 className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-3">
                {secondaryMovie.title}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">Budget</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">${secondaryMovie.budget}M</span>
                </div>
                <div className="w-full bg-[var(--color-bg-elevated)] h-1 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${secondaryMovie.budget > 0 ? Math.min((secondaryMovie.spent / secondaryMovie.budget) * 100, 100) : 0}%` }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[secondaryMovie.status] ?? "var(--color-accent-primary)" }}
                  />
                </div>
                <p className="text-right text-[10px] font-bold" style={{ color: STATUS_COLOR[secondaryMovie.status] }}>
                  {secondaryMovie.budget > 0 ? ((secondaryMovie.spent / secondaryMovie.budget) * 100).toFixed(0) : 0}% EXPENDED
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Remaining Project Cards — 3 cards × 4 cols each */}
        {remaining.slice(1).map((movie, i) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            onClick={() => setSelectedMovie(selectedMovie?.id === movie.id ? null : movie)}
            className="md:col-span-4 group rounded-xl overflow-hidden cursor-pointer"
            style={glassCard}
          >
            <div className="bg-[var(--color-bg-surface)] rounded-[10px] p-5 h-full border border-[var(--color-border-default)]/10 group-hover:border-[var(--color-accent-primary)]/20 transition-colors m-0.5">
              <div className="mb-3 opacity-60">
                <span className="text-3xl">{GENRE_ICONS[movie.genre] ?? movie.poster}</span>
              </div>
              <h4 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] mb-1">
                {movie.title}
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">{movie.genre}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-[var(--color-bg-elevated)]/40 rounded-lg">
                  <p className="text-[9px] text-[var(--color-text-muted)] font-bold mb-0.5">BUDGET</p>
                  <p className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">${movie.budget}M</p>
                </div>
                <div className={`p-2.5 rounded-lg ${movie.revenue > 0 ? "bg-[var(--color-accent-blue)]/8" : "bg-[var(--color-bg-elevated)]/40"}`}>
                  <p className={`text-[9px] font-bold mb-0.5 ${movie.revenue > 0 ? "text-[var(--color-accent-blue)]/60" : "text-[var(--color-text-muted)]"}`}>
                    {movie.status === "Released" ? "GROSS" : "SPENT"}
                  </p>
                  <p className={`text-lg font-[family-name:var(--font-display)] font-bold ${movie.revenue > 0 ? "text-[var(--color-accent-blue)]" : "text-[var(--color-text-primary)]"}`}>
                    {movie.revenue > 0 ? `$${movie.revenue}M` : `$${movie.spent}M`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: STATUS_COLOR[movie.status] ?? "var(--color-text-muted)" }}
                >
                  {statusLabel(movie.status)}
                </span>
                <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setEditingMovie({ ...movie })}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="text-[#D4534B] hover:bg-[rgba(212,83,75,0.1)] rounded transition-colors text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Footer Stats Section ── */}
      <motion.section
        variants={fadeUp}
        className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-[var(--color-border-default)]/10 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
      >
        <div>
          <p className="text-[var(--color-text-muted)] font-bold text-[10px] uppercase tracking-widest mb-2 lg:mb-3">Total Library Value</p>
          <p className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">${revenue}M</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] font-bold text-[10px] uppercase tracking-widest mb-2 lg:mb-3">Active Projects</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">{activeCount}</p>
            <span className="text-[var(--color-accent-primary)] text-xs font-bold pb-0.5">of {movies.length} total</span>
          </div>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] font-bold text-[10px] uppercase tracking-widest mb-2 lg:mb-3">Average ROI</p>
          <p className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">{avgROI}x</p>
        </div>
        <div className="flex items-center justify-start md:justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[var(--color-bg-elevated)] px-5 lg:px-6 py-2.5 rounded-full text-[var(--color-text-primary)] text-xs font-bold border border-[var(--color-border-default)]/20 hover:bg-[var(--color-bg-hover)] transition-all"
          >
            Export Financials
          </motion.button>
        </div>
      </motion.section>

      {/* ── Selected Movie Detail Drawer ── */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-xl p-5 lg:p-6 overflow-hidden"
            style={{
              background: "rgba(25,28,34,0.97)",
              border: "1px solid rgba(173,198,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedMovie.poster}</span>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
                    {selectedMovie.title}
                  </h3>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {selectedMovie.genre} · Release: {selectedMovie.releaseDate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMovie(null)}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-1">Budget</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">${selectedMovie.budget}M</p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-1">Spent</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-amber)]">${selectedMovie.spent}M</p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-1">Revenue</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-blue)]">
                  {selectedMovie.revenue > 0 ? `$${selectedMovie.revenue}M` : "—"}
                </p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-1">Rating</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-amber)]">
                  {selectedMovie.rating > 0 ? selectedMovie.rating : "—"}
                </p>
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-1">Promo Step</p>
                <p className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
                  {selectedMovie.promoStep}/9
                </p>
              </div>
            </div>

            {/* Audience breakdown */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-2">Audience</p>
                {Object.entries(selectedMovie.audience).map(([k, v], i) => (
                  <div key={k} className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] capitalize w-10" style={{ color: (["#4A90D9", "#D4534B", "#82dab0"])[i] }}>{k}</span>
                    <div className="flex-1 h-1 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: (["#4A90D9", "#D4534B", "#82dab0"])[i] }} />
                    </div>
                    <span className="text-[10px] text-[var(--color-text-primary)]">{v}%</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-2">Age Groups</p>
                {Object.entries(selectedMovie.ageGroups).map(([age, pct]) => (
                  <div key={age} className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-10 text-[var(--color-text-muted)]">{age}</span>
                    <div className="flex-1 h-1 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--color-accent-amber)]" style={{ width: `${pct * 2}%` }} />
                    </div>
                    <span className="text-[10px] text-[var(--color-text-primary)]">{pct}%</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[var(--color-bg-surface)] rounded-lg col-span-2 lg:col-span-1">
                <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase mb-2">Campaign ROI</p>
                {[
                  { l: "Social", s: selectedMovie.campaignSpend.social, r: `${(selectedMovie.campaignResults.social / 1000).toFixed(0)}K reach`, c: "#2BA5A5" },
                  { l: "Press", s: selectedMovie.campaignSpend.press, r: `${selectedMovie.campaignResults.press} pieces`, c: "#4A90D9" },
                  { l: "Digital", s: selectedMovie.campaignSpend.digital, r: `${(selectedMovie.campaignResults.digital / 1000000).toFixed(1)}M impr.`, c: "#D4903B" },
                  { l: "Events", s: selectedMovie.campaignSpend.events, r: `${selectedMovie.campaignResults.events} events`, c: "#D4534B" },
                ].map(c => (
                  <div key={c.l} className="flex justify-between mb-1 gap-2">
                    <span className="text-[10px]" style={{ color: c.c }}>{c.l}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">${c.s}M</span>
                    <span className="text-[10px] text-[var(--color-text-primary)]">{c.r}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
