"use client";

import { useStudioStore } from "@/stores/studio-store";
import { MiniBar } from "@/components/ui/mini-bar";
import { S } from "@/lib/studio-styles";
import { motion } from "framer-motion";
import { pageVariants } from "@/components/ui/motion-primitives";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ReportsPage() {
  const { movies, activities, assets } = useStudioStore();

  const totalBudget = movies.reduce((s, m) => s + m.budget, 0);
  const totalSpent = movies.reduce((s, m) => s + m.spent, 0);
  const totalRevenue = movies.reduce((s, m) => s + m.revenue, 0);
  const roi = totalSpent > 0 ? ((totalRevenue / totalSpent) * 100).toFixed(0) : "—";
  const avgCampaignSpend = movies.reduce((s, m) => s + Object.values(m.campaignSpend).reduce((a, b) => a + b, 0), 0);
  const totalImpressions = movies.reduce((s, m) => s + m.campaignResults.digital, 0);
  const totalSocial = movies.reduce((s, m) => s + m.campaignResults.social, 0);
  const totalPress = movies.reduce((s, m) => s + m.campaignResults.press, 0);
  const releasedFilms = movies.filter(m => m.status === "Released");
  const avgRating = releasedFilms.length ? (releasedFilms.reduce((s, m) => s + m.rating, 0) / releasedFilms.length).toFixed(1) : "—";
  const bestPerformer = releasedFilms.reduce((best, m) => (!best || m.revenue > best.revenue ? m : best), null as typeof movies[0] | null);
  const pendingAssets = assets.filter(a => a.status !== "approved").length;

  const monthlyData = [
    { social: 120, press: 45, digital: 230, events: 18 },
    { social: 180, press: 62, digital: 310, events: 22 },
    { social: 245, press: 78, digital: 420, events: 35 },
    { social: 320, press: 95, digital: 580, events: 42 },
    { social: 410, press: 120, digital: 780, events: 55 },
    { social: 520, press: 145, digital: 960, events: 68 },
    { social: 480, press: 130, digital: 870, events: 60 },
    { social: 550, press: 155, digital: 1100, events: 72 },
    { social: 620, press: 170, digital: 1250, events: 80 },
    { social: 580, press: 160, digital: 1180, events: 75 },
    { social: 650, press: 185, digital: 1350, events: 88 },
    { social: 700, press: 200, digital: 1500, events: 95 },
  ];

  return (
    <>
      <style>{`
        .reports-exec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .reports-main { display: grid; grid-template-columns: 1fr 360px; gap: 18px; }
        .reports-perf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 1023px) { .reports-main { grid-template-columns: 1fr; } .reports-exec-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 639px) { .reports-exec-grid { grid-template-columns: 1fr; } .reports-perf-grid { grid-template-columns: 1fr; } }
      `}</style>
      <motion.div 
        variants={pageVariants.reports.container}
        initial="hidden"
        animate="show"
        style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 22 }}
      >
        {/* Executive Summary */}
        <div className="reports-exec-grid">
          {[
            { label: "Portfolio Value", value: `$${totalBudget}M`, sub: `${movies.length} active projects`, color: "#D4534B", icon: "🎬" },
            { label: "Total Revenue", value: `$${totalRevenue}M`, sub: `${roi}% overall ROI`, color: "#3BA55C", icon: "💰" },
            { label: "Campaign Spend", value: `$${avgCampaignSpend.toFixed(1)}M`, sub: "across all channels", color: "#4A90D9", icon: "📣" },
            { label: "Digital Impressions", value: `${(totalImpressions / 1000000).toFixed(1)}M`, sub: "total reach", color: "#8E5BB5", icon: "👁️" },
            { label: "Social Engagement", value: `${(totalSocial / 1000).toFixed(0)}K`, sub: "interactions", color: "#2BA5A5", icon: "📱" },
            { label: "Press Coverage", value: `${totalPress}`, sub: "media placements", color: "#CF7A30", icon: "📰" },
          ].map(stat => (
            <motion.div key={stat.label} variants={pageVariants.reports.item} whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }} style={{ ...S.card, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ ...S.label, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ color: stat.color, fontSize: 26, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: "#5A5347", fontSize: 12, marginTop: 2 }}>{stat.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="reports-main">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Film Performance */}
            <motion.div variants={pageVariants.reports.item} style={S.card}>
              <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 18px" }}>Film Performance</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 480 }}>
                  <thead><tr>
                    {["Film", "Status", "Budget", "Spent", "Revenue", "ROI", "Rating"].map(h => (
                      <th key={h} style={{ ...S.label, textAlign: h === "Film" ? "left" : "center", padding: "6px 8px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {movies.map(m => {
                      const mRoi = m.spent > 0 && m.revenue > 0 ? ((m.revenue / m.spent) * 100).toFixed(0) : "—";
                      return (
                        <tr key={m.id} style={{ background: "rgba(255,255,255,0.02)" }}>
                          <td style={{ padding: "10px 8px", color: "#D6C6AA", fontSize: 14, whiteSpace: "nowrap" }}>{m.poster} {m.title}</td>
                          <td style={{ textAlign: "center", padding: 6 }}>
                            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: m.status === "Released" ? "rgba(59,165,92,0.12)" : "rgba(212,144,59,0.12)", color: m.status === "Released" ? "#3BA55C" : "#D4903B" }}>{m.status}</span>
                          </td>
                          <td style={{ textAlign: "center", color: "#7A7062", fontSize: 13, padding: 6 }}>${m.budget}M</td>
                          <td style={{ textAlign: "center", padding: 6 }}><span style={{ color: m.spent / m.budget > 0.9 ? "#D4534B" : "#D6C6AA", fontSize: 13 }}>${m.spent}M</span></td>
                          <td style={{ textAlign: "center", color: m.revenue > 0 ? "#3BA55C" : "#3A362F", fontSize: 13, padding: 6 }}>{m.revenue > 0 ? `$${m.revenue}M` : "—"}</td>
                          <td style={{ textAlign: "center", color: mRoi !== "—" && parseInt(mRoi) > 100 ? "#3BA55C" : mRoi !== "—" ? "#D4903B" : "#3A362F", fontSize: 13, fontWeight: 600, padding: 6 }}>{mRoi !== "—" ? `${mRoi}%` : "—"}</td>
                          <td style={{ textAlign: "center", padding: 6 }}><span style={{ color: m.rating > 0 ? "#D6C6AA" : "#3A362F", fontSize: 13, fontWeight: 600 }}>{m.rating > 0 ? m.rating : "—"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Campaign Channel Trends */}
            <motion.div variants={pageVariants.reports.item} style={S.card}>
              <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 16px" }}>Campaign Channel Trends</h4>
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 140 }}>
                {monthlyData.map((month, i) => {
                  const total = month.social + month.press + month.digital + month.events;
                  const maxTotal = 1800;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <span style={{ color: "#5A5347", fontSize: 9 }}>{total > 999 ? `${(total / 1000).toFixed(1)}K` : total}</span>
                      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                        <div style={{ height: `${(month.digital / maxTotal) * 100}px`, background: "#8E5BB5", borderRadius: "3px 3px 0 0", minHeight: 1 }} />
                        <div style={{ height: `${(month.social / maxTotal) * 40}px`, background: "#2BA5A5", minHeight: 1 }} />
                        <div style={{ height: `${(month.press / maxTotal) * 20}px`, background: "#4A90D9", minHeight: 1 }} />
                        <div style={{ height: `${(month.events / maxTotal) * 10}px`, background: "#D4903B", borderRadius: "0 0 3px 3px", minHeight: 1 }} />
                      </div>
                      <span style={{ color: "#5A5347", fontSize: 9 }}>{MONTHS_SHORT[i]}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
                {[{ l: "Digital", c: "#8E5BB5" }, { l: "Social", c: "#2BA5A5" }, { l: "Press", c: "#4A90D9" }, { l: "Events", c: "#D4903B" }].map(x => (
                  <span key={x.l} style={{ color: x.c, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c, display: "inline-block" }} />
                    {x.l}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Film Comparison (released only) */}
            <div className="reports-perf-grid">
              {releasedFilms.map(m => {
                const totalCampaign = Object.values(m.campaignSpend).reduce((s, v) => s + v, 0);
                const costPerImpression = totalCampaign > 0 && m.campaignResults.digital > 0 ? (totalCampaign / (m.campaignResults.digital / 1000000)).toFixed(2) : "—";
                return (
                  <div key={m.id} style={S.card}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 24 }}>{m.poster}</span>
                      <div>
                        <div style={{ color: "#D6C6AA", fontSize: 16, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 600 }}>{m.title}</div>
                        <div style={{ color: "#5A5347", fontSize: 12 }}>Released {m.releaseDate}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div style={{ background: "rgba(59,165,92,0.06)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                        <div style={{ color: "#3BA55C", fontSize: 20, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{((m.revenue / m.budget) * 100).toFixed(0)}%</div>
                        <div style={{ color: "#5A5347", fontSize: 10 }}>ROI</div>
                      </div>
                      <div style={{ background: "rgba(212,83,75,0.06)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                        <div style={{ color: "#D4534B", fontSize: 20, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{m.rating}</div>
                        <div style={{ color: "#5A5347", fontSize: 10 }}>Rating</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        { l: "Revenue", v: `$${m.revenue}M`, p: (m.revenue / 500) * 100, c: "#3BA55C" },
                        { l: "Budget", v: `$${m.budget}M`, p: (m.budget / 500) * 100, c: "#D4903B" },
                        { l: "Campaign", v: `$${totalCampaign.toFixed(1)}M`, p: (totalCampaign / 40) * 100, c: "#4A90D9" },
                      ].map(row => (
                        <div key={row.l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#7A7062", fontSize: 11, width: 62 }}>{row.l}</span>
                          <div style={{ flex: 1 }}><MiniBar value={row.p} max={100} color={row.c} h={5} /></div>
                          <span style={{ color: "#D6C6AA", fontSize: 11, width: 52, textAlign: "right" }}>{row.v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
                      <span style={{ color: "#5A5347", fontSize: 10 }}>Cost per M impressions: </span>
                      <span style={{ color: "#D6C6AA", fontSize: 11, fontWeight: 600 }}>${costPerImpression}M</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={S.card}>
              <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 16, margin: "0 0 16px" }}>Quick Insights</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {bestPerformer && (
                  <div style={{ background: "rgba(59,165,92,0.06)", border: "1px solid rgba(59,165,92,0.15)", borderRadius: 10, padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span>🏆</span><span style={{ ...S.label, margin: 0 }}>Top Performer</span></div>
                    <div style={{ color: "#D6C6AA", fontSize: 16, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 600 }}>{bestPerformer.poster} {bestPerformer.title}</div>
                    <div style={{ color: "#3BA55C", fontSize: 13, marginTop: 4 }}>${bestPerformer.revenue}M revenue · {bestPerformer.rating} rating</div>
                  </div>
                )}
                <div style={{ background: "rgba(212,144,59,0.06)", border: "1px solid rgba(212,144,59,0.15)", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span>📊</span><span style={{ ...S.label, margin: 0 }}>Average Rating</span></div>
                  <div style={{ color: "#D4903B", fontSize: 26, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{avgRating}</div>
                  <div style={{ color: "#5A5347", fontSize: 12 }}>{releasedFilms.length} released film{releasedFilms.length !== 1 ? "s" : ""}</div>
                </div>
                <div style={{ background: "rgba(74,144,217,0.06)", border: "1px solid rgba(74,144,217,0.15)", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span>📁</span><span style={{ ...S.label, margin: 0 }}>Asset Pipeline</span></div>
                  <div style={{ color: "#4A90D9", fontSize: 20, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700 }}>{assets.length} files</div>
                  <div style={{ color: "#5A5347", fontSize: 12 }}>{pendingAssets} pending approval</div>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 16, margin: "0 0 14px" }}>Budget Allocation</h4>
              {movies.map(m => {
                const pct = totalBudget > 0 ? (m.budget / totalBudget) * 100 : 0;
                return (
                  <div key={m.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#D6C6AA", fontSize: 13 }}>{m.poster} {m.title}</span>
                      <span style={{ color: "#7A7062", fontSize: 12 }}>{pct.toFixed(0)}%</span>
                    </div>
                    <MiniBar value={pct} max={100} color="#D4534B" h={6} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                      <span style={{ color: "#5A5347", fontSize: 10 }}>${m.spent}M spent</span>
                      <span style={{ color: "#5A5347", fontSize: 10 }}>${m.budget}M total</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={S.card}>
              <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 16, margin: "0 0 14px" }}>Recent Activity</h4>
              {activities.slice(0, 6).map(a => (
                <div key={a.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(214,198,170,0.04)" }}>
                  <span style={{ fontSize: 14 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#9A8E7E", fontSize: 12, lineHeight: 1.5 }}>
                      <strong style={{ color: "#B5A88E" }}>{a.user}</strong> {a.action} <strong style={{ color: "#B5A88E" }}>{a.target}</strong>
                    </div>
                    <span style={{ color: "#3A362F", fontSize: 10 }}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
