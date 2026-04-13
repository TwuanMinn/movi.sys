"use client";

import { useStudioStore } from "@/stores/studio-store";
import { ASSET_STATUS_COLOR } from "@/lib/studio-styles";
import { motion } from "framer-motion";
import { useState } from "react";

/** Material Symbol icon helper */
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

/** Maps asset type → Material Symbol */
const TYPE_ICON: Record<string, { icon: string; color: string }> = {
  video: { icon: "movie", color: "#4b8eff" },
  image: { icon: "image", color: "#f0a060" },
  document: { icon: "description", color: "#82dab0" },
  archive: { icon: "folder_zip", color: "#adc6ff" },
};

const FILTER_OPTIONS = ["all", "approved", "pending", "in_review"] as const;
const TYPE_OPTIONS = ["all", "video", "image", "document", "archive"] as const;
type ViewMode = "grid" | "list";

export default function AssetsPage() {
  const { assets, assetFilter, setAssetFilter, approveAsset, movies } = useStudioStore();
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedAsset, setSelectedAsset] = useState(assets[0] ?? null);

  const filtered = assetFilter === "all" ? assets : assets.filter((a) => a.status === assetFilter || a.type === assetFilter);

  const byMovie = movies.map((m) => ({
    movie: m,
    count: assets.filter((a) => a.movie === m.title).length,
  }));

  return (
    <div className="px-6 lg:px-10 py-6 lg:py-8 flex flex-col gap-6">
      {/* ── Editorial Header ── */}
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-1">
          Assets Library
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Manage and preview all production materials for your films.
        </p>
      </header>

      {/* ── Filters & View Switcher ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[var(--color-bg-elevated)] p-1 rounded-xl overflow-x-auto">
          {[...FILTER_OPTIONS, ...TYPE_OPTIONS.slice(1)].map((f) => (
            <button
              key={f}
              onClick={() => setAssetFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                assetFilter === f
                  ? "bg-[var(--color-accent-blue)] text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {f === "all" ? "All Assets" : f.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--color-bg-elevated)] p-1 rounded-lg">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded ${view === "grid" ? "bg-[var(--color-bg-surface)] text-[var(--color-accent-blue)] shadow-sm" : "text-[var(--color-text-muted)]"}`}
            >
              <MI name="grid_view" className="text-lg" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded ${view === "list" ? "bg-[var(--color-bg-surface)] text-[var(--color-accent-blue)] shadow-sm" : "text-[var(--color-text-muted)]"}`}
            >
              <MI name="list" className="text-lg" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-[var(--color-accent-blue)] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-accent-blue)]/10 hover:scale-105 transition-transform">
            <MI name="upload_file" className="text-[18px]" />
            Upload Asset
          </button>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Asset Grid / List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((asset, i) => {
                const typeInfo = TYPE_ICON[asset.type] ?? { icon: "folder", color: "#8b90a0" };
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group bg-[var(--color-bg-surface)] rounded-xl p-3 border transition-all cursor-pointer ${
                      selectedAsset?.id === asset.id
                        ? "border-[var(--color-accent-blue)]/30 shadow-lg shadow-[var(--color-accent-blue)]/5"
                        : "border-[var(--color-border-default)]/20 hover:border-[var(--color-accent-blue)]/10 hover:shadow-md"
                    }`}
                  >
                    {/* Preview */}
                    <div className="aspect-video rounded-lg bg-[var(--color-bg-elevated)] flex flex-col items-center justify-center mb-3 relative overflow-hidden">
                      <MI name={typeInfo.icon} className="text-4xl opacity-30" style={{ color: typeInfo.color }} />
                      <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1">
                        {asset.type}
                      </span>
                      {asset.type === "video" && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {asset.size}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="px-1">
                      <h3 className="font-bold text-[var(--color-text-primary)] text-sm truncate">{asset.name}</h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                          <MI name={typeInfo.icon} className="text-xs" style={{ color: typeInfo.color }} />
                          {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">{asset.size}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border-default)]/20 overflow-hidden">
              <div className="divide-y divide-[var(--color-border-default)]/10">
                {filtered.map((asset) => {
                  const typeInfo = TYPE_ICON[asset.type] ?? { icon: "folder", color: "#8b90a0" };
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-bg-hover)]/50 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${typeInfo.color}15` }}
                      >
                        <MI name={typeInfo.icon} className="text-[20px]" style={{ color: typeInfo.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{asset.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{asset.movie} · {asset.uploader}</p>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] font-mono">{asset.size}</span>
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                        style={{
                          background: `${ASSET_STATUS_COLOR[asset.status] ?? "#8b90a0"}15`,
                          color: ASSET_STATUS_COLOR[asset.status] ?? "#8b90a0",
                        }}
                      >
                        {asset.status.replace("_", " ")}
                      </span>
                      {asset.status === "pending" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); approveAsset(asset.id); }}
                          className="text-[var(--color-accent-blue)] font-bold text-xs uppercase tracking-wider px-3 py-1.5 hover:bg-[var(--color-accent-blue)]/5 rounded-lg"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              <MI name="folder_off" className="text-4xl mb-2 block mx-auto opacity-40" />
              No assets match this filter.
            </div>
          )}
        </div>

        {/* ── Preview Panel (Side) ── */}
        <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-20 self-start">
          <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border-default)]/20 p-6 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-[var(--color-text-primary)]">Quick Preview</h2>
              <MI name="more_vert" className="text-[var(--color-text-muted)]" />
            </div>

            {selectedAsset ? (
              <div className="space-y-5">
                {/* Preview Area */}
                <div className="aspect-video rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center">
                  <MI
                    name={TYPE_ICON[selectedAsset.type]?.icon ?? "folder"}
                    className="text-5xl opacity-30"
                    style={{ color: TYPE_ICON[selectedAsset.type]?.color ?? "#8b90a0" }}
                  />
                </div>

                {/* Asset Info */}
                <div>
                  <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                    Asset Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Filename", value: selectedAsset.name },
                      { label: "Format", value: selectedAsset.type.toUpperCase() },
                      { label: "Size", value: selectedAsset.size },
                      { label: "Project", value: selectedAsset.movie },
                      { label: "Owner", value: selectedAsset.uploader },
                      { label: "Uploaded", value: selectedAsset.date },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center text-sm">
                        <span className="text-[var(--color-text-secondary)]">{row.label}</span>
                        <span className="font-semibold text-[var(--color-text-primary)] text-right truncate ml-4 max-w-[60%]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Status</h3>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
                    style={{
                      background: `${ASSET_STATUS_COLOR[selectedAsset.status] ?? "#8b90a0"}15`,
                      color: ASSET_STATUS_COLOR[selectedAsset.status] ?? "#8b90a0",
                    }}
                  >
                    {selectedAsset.status.replace("_", " ")}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] py-3 rounded-xl font-bold text-sm hover:bg-[var(--color-bg-hover)] transition-colors">
                    Download
                  </button>
                  {selectedAsset.status === "pending" ? (
                    <button
                      onClick={() => approveAsset(selectedAsset.id)}
                      className="bg-[var(--color-accent-blue)] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-accent-blue)]/20 hover:opacity-90 transition-all"
                    >
                      Approve
                    </button>
                  ) : (
                    <button className="bg-[var(--color-accent-blue)] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-accent-blue)]/20 hover:opacity-90 transition-all">
                      Send to Edit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                <MI name="preview" className="text-3xl mb-2 block mx-auto opacity-40" />
                <p className="text-sm">Select an asset to preview</p>
              </div>
            )}
          </div>

          {/* Assets by Project */}
          <div className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border-default)]/20 p-6 mt-5">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Assets by Project</h3>
            {byMovie.map(({ movie, count }) => (
              <div key={movie.id} className="flex items-center gap-3 mb-3">
                <span className="text-lg">{movie.poster}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[var(--color-text-primary)] text-sm truncate">{movie.title}</span>
                    <span className="text-[var(--color-text-muted)] text-xs">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent-blue)] rounded-full"
                      style={{ width: `${assets.length > 0 ? (count / assets.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
