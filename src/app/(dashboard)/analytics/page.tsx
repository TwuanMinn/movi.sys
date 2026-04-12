"use client";

import { useStudioStore } from "@/stores/studio-store";
import { MiniBar } from "@/components/ui/mini-bar";
import { S } from "@/lib/studio-styles";
import { motion } from "framer-motion";
import { pageVariants } from "@/components/ui/motion-primitives";

export default function AnalyticsPage() {
  const { movies } = useStudioStore();

  return (
    <>
      <style>{`
        .analytics-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .analytics-rev-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
        .analytics-genre-roi { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .analytics-heatmap { overflow-x: auto; }
        .analytics-heatmap table { min-width: 500px; }
        .analytics-legend { display: flex; gap: 14px; margin-top: 12px; flex-wrap: wrap; }
        @media (max-width: 1023px) { .analytics-rev-grid { grid-template-columns: 1fr; } }
        @media (max-width: 639px) { .analytics-two-col { grid-template-columns: 1fr; } }
      `}</style>
      <motion.div 
        variants={pageVariants.analytics.container}
        initial="hidden"
        animate="show"
        style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div className="analytics-two-col">
          {/* Revenue vs Budget */}
          <motion.div variants={pageVariants.analytics.item} style={S.card}>
            <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 16px" }}>Revenue vs Budget</h4>
            {movies.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>{m.poster}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ color: "#D6C6AA", fontSize: 14 }}>{m.title}</span>
                    <span style={{ color: m.revenue > m.budget ? "#3BA55C" : "#D4903B", fontSize: 12 }}>{m.revenue > 0 ? `${((m.revenue / m.budget) * 100).toFixed(0)}% ROI` : "—"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 2, height: 8 }}>
                    <div style={{ width: `${(m.budget / 500) * 100}%`, background: "rgba(212,83,75,0.35)", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ width: `${(m.revenue / 500) * 100}%`, background: "#3BA55C", borderRadius: "0 3px 3px 0" }} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Campaign Spend */}
          <motion.div variants={pageVariants.analytics.item} style={S.card}>
            <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 16px" }}>Campaign Spend Mix</h4>
            {movies.filter(m => Object.values(m.campaignSpend).reduce((s, v) => s + v, 0) > 0).map(m => {
              const total = Object.values(m.campaignSpend).reduce((s, v) => s + v, 0);
              const channels = [
                { k: "social" as keyof typeof m.campaignSpend, c: "#2BA5A5" },
                { k: "press" as keyof typeof m.campaignSpend, c: "#4A90D9" },
                { k: "digital" as keyof typeof m.campaignSpend, c: "#8E5BB5" },
                { k: "events" as keyof typeof m.campaignSpend, c: "#D4903B" },
              ];
              return (
                <div key={m.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ color: "#D6C6AA", fontSize: 14 }}>{m.poster} {m.title}</span>
                    <span style={{ color: "#7A7062", fontSize: 12 }}>${total.toFixed(1)}M</span>
                  </div>
                  <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", gap: 1 }}>
                    {channels.map(ch => (
                      <div key={ch.k} style={{ width: `${(m.campaignSpend[ch.k] / total) * 100}%`, background: ch.c }} />
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="analytics-legend">
              {[{ l: "Social", c: "#2BA5A5" }, { l: "Press", c: "#4A90D9" }, { l: "Digital", c: "#8E5BB5" }, { l: "Events", c: "#D4903B" }].map(x => (
                <span key={x.l} style={{ color: x.c, fontSize: 12 }}>● {x.l}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Engagement heatmap */}
        <motion.div variants={pageVariants.analytics.item} style={S.card} className="analytics-heatmap">
          <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 16px" }}>Engagement Heatmap</h4>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 5 }}>
            <thead><tr>
              <th style={{ ...S.label, textAlign: "left", padding: "6px 10px" }}>Film</th>
              {["Social", "Press", "Trailers", "Pre-sales", "Merch", "Streaming"].map(h => (
                <th key={h} style={{ color: "#7A7062", fontSize: 11, textAlign: "center", padding: "6px 6px" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {movies.map(m => {
                const vals = m.status === "Released" ? [88, 92, 95, 85, 70, 90] : m.status === "Post-Production" ? [72, 55, 80, 40, 30, 65] : m.status === "In Production" ? [45, 30, 20, 0, 10, 35] : [15, 5, 0, 0, 0, 10];
                return (
                  <tr key={m.id}>
                    <td style={{ color: "#D6C6AA", fontSize: 13, padding: "6px 10px", whiteSpace: "nowrap" }}>{m.poster} {m.title}</td>
                    {vals.map((v, i) => (
                      <td key={i} style={{ textAlign: "center", padding: 5, background: v > 80 ? "rgba(59,165,92,0.2)" : v > 50 ? "rgba(212,144,59,0.15)" : v > 20 ? "rgba(212,83,75,0.12)" : "rgba(255,255,255,0.02)", borderRadius: 6, color: v > 80 ? "#3BA55C" : v > 50 ? "#D4903B" : v > 20 ? "#D4534B" : "#3A362F", fontSize: 13, fontWeight: 600 }}>
                        {v > 0 ? v : "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Monthly revenue + genre ROI */}
        <div className="analytics-rev-grid">
          <motion.div variants={pageVariants.analytics.item} style={S.card}>
            <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 14px" }}>Monthly Revenue Trend</h4>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 120 }}>
              {[12, 18, 32, 55, 88, 105, 72, 45, 68, 95, 110, 85].map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ color: "#7A7062", fontSize: 10 }}>${v}M</span>
                  <div style={{ width: "100%", height: `${(v / 120) * 100}%`, minHeight: 4, background: `linear-gradient(180deg, #D4534B, ${i % 2 === 0 ? "#D4903B" : "#8E5BB5"})`, borderRadius: "3px 3px 0 0" }} />
                  <span style={{ color: "#5A5347", fontSize: 10 }}>{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="analytics-genre-roi">
            {[{ g: "Action", r: 180, c: "#D4534B" }, { g: "Drama", r: 206, c: "#4A90D9" }, { g: "Horror", r: 0, c: "#3BA55C" }, { g: "Romance", r: 0, c: "#D4903B" }].map(x => (
              <div key={x.g} style={{ background: `${x.c}08`, border: `1px solid ${x.c}18`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ color: x.c, fontSize: 13, fontWeight: 600 }}>{x.g}</div>
                <div style={{ color: "#D6C6AA", fontSize: 22, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{x.r > 0 ? `${x.r}%` : "—"}</div>
                <div style={{ color: "#7A7062", fontSize: 11 }}>ROI</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
