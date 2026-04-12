"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/effects/spotlight-card";
import { useStudioStore } from "@/stores/studio-store";
import { STATUS_COLOR } from "@/lib/studio-styles";

/**
 * Movies grid page — filterable, animated entries.
 * Now powered by the global Zustand store instead of isolated demo data.
 */

const GENRE_GRADIENTS: Record<string, string> = {
  Action: "from-[oklch(0.35_0.15_20)] to-[oklch(0.15_0.05_30)]",
  Drama: "from-[oklch(0.30_0.10_245)] to-[oklch(0.12_0.05_250)]",
  "Sci-Fi": "from-[oklch(0.40_0.12_75)] to-[oklch(0.15_0.05_70)]",
  Horror: "from-[oklch(0.20_0.10_300)] to-[oklch(0.08_0.05_310)]",
  Romance: "from-[oklch(0.45_0.15_340)] to-[oklch(0.15_0.05_345)]",
  Comedy: "from-[oklch(0.45_0.15_50)] to-[oklch(0.15_0.05_45)]",
  Thriller: "from-[oklch(0.30_0.08_65)] to-[oklch(0.12_0.03_60)]",
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MoviesPage() {
  const { movies, setShowMovieModal, setEditingMovie, handleDeleteMovie, selectedMovie, setSelectedMovie } = useStudioStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-wider text-[var(--color-text-primary)]">
            Productions
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {movies.length} projects across every phase
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMovieModal(true)}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-accent-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-inverse)] transition-shadow hover:shadow-[var(--shadow-glow)]"
        >
          <span>+</span> New Project
        </motion.button>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {movies.map((movie, i) => {
          const gradient = GENRE_GRADIENTS[movie.genre] ?? GENRE_GRADIENTS.Action;
          const statusClr = STATUS_COLOR[movie.status] ?? "var(--color-text-muted)";
          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <SpotlightCard className="cursor-pointer" onClick={() => setSelectedMovie(selectedMovie?.id === movie.id ? null : movie)}>
                {/* Poster gradient */}
                <div
                  className={`h-40 bg-gradient-to-br ${gradient} rounded-t-[var(--radius-md)] flex items-end p-4`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{movie.poster}</span>
                    <span
                      className="inline-block text-xs font-semibold uppercase tracking-wider"
                      style={{ color: statusClr }}
                    >
                      {statusLabel(movie.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text-primary)]">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {movie.genre} · {movie.releaseDate}
                  </p>

                  {/* Budget bar */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min((movie.spent / movie.budget) * 100, 100)}%`,
                          backgroundColor: movie.spent / movie.budget > 0.9 ? "#D4534B" : "#D4903B",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs text-[var(--color-text-muted)]">${movie.spent}M / ${movie.budget}M</span>
                      {movie.revenue > 0 && (
                        <span className="text-xs" style={{ color: "#3BA55C" }}>+${movie.revenue}M</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full border border-[var(--color-border-default)] px-2.5 py-0.5 text-xs text-[var(--color-text-secondary)]">
                      {movie.genre}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingMovie({ ...movie }); }}
                        className="text-xs px-2 py-1 rounded border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMovie(movie.id); }}
                        className="text-xs px-2 py-1 rounded border border-[var(--color-border-default)] text-[#D4534B] hover:bg-[rgba(212,83,75,0.1)] transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
