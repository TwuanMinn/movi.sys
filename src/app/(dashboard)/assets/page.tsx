"use client";

import { useStudioStore } from "@/stores/studio-store";
import { S, ASSET_STATUS_COLOR, ASSET_ICON } from "@/lib/studio-styles";

const FILTER_OPTIONS = ["all", "approved", "pending", "in_review"];
const TYPE_OPTIONS = ["all", "video", "image", "document", "archive"];

export default function AssetsPage() {
  const { assets, assetFilter, setAssetFilter, approveAsset, movies } = useStudioStore();
  const filtered = assetFilter === "all" ? assets : assets.filter(a => a.status === assetFilter || a.type === assetFilter);

  const totalGB = assets.reduce((s, a) => {
    const n = parseFloat(a.size);
    return s + (a.size.includes("GB") ? n : n / 1024);
  }, 0);

  const byMovie = movies.map(m => ({
    movie: m,
    count: assets.filter(a => a.movie === m.title).length,
  }));

  return (
    <>
      <style>{`
        .assets-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .assets-main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 18px; }
        .assets-filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
        @media (max-width: 1023px) {
          .assets-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .assets-main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 639px) { .assets-stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="assets-stats-grid">
          {[
            { label: "Total Assets", value: assets.length, color: "#D4534B" },
            { label: "Pending Review", value: assets.filter(a => a.status === "pending").length, color: "#D4903B" },
            { label: "Approved", value: assets.filter(a => a.status === "approved").length, color: "#3BA55C" },
            { label: "Storage Used", value: `${totalGB.toFixed(1)} GB`, color: "#4A90D9" },
          ].map(stat => (
            <div key={stat.label} style={{ ...S.card, textAlign: "center" }}>
              <div style={{ ...S.label, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: 28, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="assets-filter-bar">
          {[...FILTER_OPTIONS, ...TYPE_OPTIONS.slice(1)].map(f => (
            <button key={f} onClick={() => setAssetFilter(f)} style={{ background: assetFilter === f ? "rgba(212,83,75,0.15)" : "rgba(28,25,21,0.7)", border: `1px solid ${assetFilter === f ? "rgba(212,83,75,0.3)" : "rgba(214,198,170,0.05)"}`, color: assetFilter === f ? "#D4534B" : "#7A7062", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, textTransform: "capitalize" }}>
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="assets-main-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((asset) => (
              <div key={asset.id} style={{ background: "rgba(28,25,21,0.7)", border: "1px solid rgba(214,198,170,0.05)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {ASSET_ICON[asset.type] ?? "📁"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#D6C6AA", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{asset.name}</div>
                  <div style={{ color: "#5A5347", fontSize: 12, marginTop: 3 }}>{asset.movie} · {asset.uploader} · {asset.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
                  <span style={{ color: "#7A7062", fontSize: 12 }}>{asset.size}</span>
                  <span style={{ background: `${ASSET_STATUS_COLOR[asset.status] ?? "#7A7062"}15`, color: ASSET_STATUS_COLOR[asset.status] ?? "#7A7062", fontSize: 11, padding: "3px 9px", borderRadius: 20, textTransform: "capitalize" }}>{asset.status.replace("_", " ")}</span>
                  {asset.status === "pending" && (
                    <button onClick={() => approveAsset(asset.id)} style={{ ...S.btnP, padding: "5px 12px", fontSize: 12 }}>Approve</button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ color: "#5A5347", fontSize: 14, textAlign: "center", padding: 36 }}>No assets match this filter.</div>
            )}
          </div>

          <div style={S.card}>
            <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 16, margin: "0 0 16px" }}>Assets by Project</h4>
            {byMovie.map(({ movie, count }) => (
              <div key={movie.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>{movie.poster}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#D6C6AA", fontSize: 13 }}>{movie.title}</span>
                    <span style={{ color: "#7A7062", fontSize: 12 }}>{count} files</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / assets.length) * 100}%`, background: "#D4534B", borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(214,198,170,0.05)", paddingTop: 14, marginTop: 6 }}>
              <div style={{ ...S.label, marginBottom: 10 }}>By Type</div>
              {["video", "image", "document", "archive"].map(type => {
                const count = assets.filter(a => a.type === type).length;
                return (
                  <div key={type} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#7A7062", fontSize: 13 }}>{ASSET_ICON[type]} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span style={{ color: "#D6C6AA", fontSize: 13 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
