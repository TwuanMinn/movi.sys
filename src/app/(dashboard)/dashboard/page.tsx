"use client";

import { useStudioStore } from "@/stores/studio-store";
import { MiniBar } from "@/components/ui/mini-bar";
import { Sparkline } from "@/components/ui/sparkline";
import { ModalBox } from "@/components/ui/modal-box";
import { AnimatedCounter, RippleButton } from "@/components/ui/motion-primitives";
import { S, STATUS_COLOR } from "@/lib/studio-styles";
import { GENRES, STATUSES, POSTER_OPTIONS } from "@/lib/studio-data";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LIST = ["Pre-Production", "In Production", "Post-Production", "Released"];

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashboardPage() {
  const store = useStudioStore();
  const filteredMovies = store.filteredMovies();
  const totalBudget = store.totalBudget();
  const totalSpent = store.totalSpent();
  const totalRevenue = store.totalRevenue();
  const releasedMovies = store.releasedMovies();
  const avgRating = store.avgRating();

  const kpis = [
    { label: "Total Budget", value: `$${totalBudget}M`, sub: `$${totalSpent}M spent`, color: "#D4534B", spark: [80, 95, 110, 125, 140, 150, totalBudget] },
    { label: "Revenue", value: `$${totalRevenue}M`, sub: totalSpent > 0 ? `${((totalRevenue / totalSpent) * 100).toFixed(0)}% ROI` : "—", color: "#3BA55C", spark: [20, 45, 120, 180, 320, 420, totalRevenue] },
    { label: "Active Projects", value: store.movies.filter(m => m.status !== "Released").length, sub: `${store.movies.length} total films`, color: "#4A90D9", spark: [2, 3, 3, 4, 5, 4, store.movies.length] },
    { label: "Avg Rating", value: avgRating, sub: `${releasedMovies.length} released`, color: "#D4903B", spark: [6.5, 7.2, 7.8, 8.1, 7.8, 8.4, parseFloat(avgRating) || 0] },
  ];

  return (
    <>
      <style>{`
        .dash-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .dash-portfolio-grid { display: grid; grid-template-columns: 1fr 340px; gap: 18px; }
        .dash-detail-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .dash-collab-input { display: flex; gap: 8px; margin-bottom: 16px; }
        .dash-collab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .dash-portfolio-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        @media (max-width: 1023px) {
          .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-portfolio-grid { grid-template-columns: 1fr; }
          .dash-detail-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .dash-kpi-grid { grid-template-columns: 1fr; }
          .dash-detail-grid { grid-template-columns: 1fr; }
          .dash-collab-input { flex-direction: column; }
          .dash-collab-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .dash-portfolio-header { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>
      <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* KPI cards */}
        <div className="dash-kpi-grid">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(212,83,75,0.08)" }}
              style={{ ...S.card }}
            >
              <div style={{ ...S.label, marginBottom: 12 }}>{kpi.label}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <span style={{ color: "#D6C6AA", fontSize: 32, fontWeight: 700, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}>
                  <AnimatedCounter value={kpi.value} duration={1.4} />
                </span>
                <Sparkline data={kpi.spark} color={kpi.color} />
              </div>
              <span style={{ color: kpi.color, fontSize: 13, marginTop: 8, display: "block" }}>{kpi.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* Portfolio + Activity */}
        <div className="dash-portfolio-grid">
          <div>
            <div className="dash-portfolio-header">
              <h3 style={S.h3}>Film Portfolio</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select value={store.filterStatus} onChange={e => store.setFilterStatus(e.target.value)} style={{ ...S.input, width: "auto", padding: "6px 12px", fontSize: 13 }}>
                  <option value="all">All Status</option>
                  {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <RippleButton
                  onClick={() => store.setShowMovieModal(true)} 
                  style={S.btnP}
                >
                  + New Film
                </RippleButton>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatePresence mode="popLayout">
                {filteredMovies.map((m, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    key={m.id}
                    onClick={() => store.setSelectedMovie(store.selectedMovie?.id === m.id ? null : m)}
                    style={{ background: store.selectedMovie?.id === m.id ? "rgba(214,198,170,0.06)" : "rgba(28,25,21,0.7)", border: `1px solid ${store.selectedMovie?.id === m.id ? "rgba(214,198,170,0.15)" : "rgba(214,198,170,0.05)"}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(214,198,170,0.08)" }}
                  >
                    <motion.span layoutId={`poster-${m.id}`} style={{ fontSize: 32, width: 40, textAlign: "center" }}>{m.poster}</motion.span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ color: "#D6C6AA", fontSize: 16, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 600 }}>{m.title}</span>
                        <span style={{ background: `${STATUS_COLOR[m.status]}15`, color: STATUS_COLOR[m.status], fontSize: 11, padding: "3px 9px", borderRadius: 20 }}>{statusLabel(m.status)}</span>
                      </div>
                      <span style={{ color: "#7A7062", fontSize: 13 }}>{m.genre} · {m.releaseDate}</span>
                      <MiniBar value={m.spent} max={m.budget} color={m.spent / m.budget > 0.9 ? "#D4534B" : "#D4903B"} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, flexWrap: "wrap", gap: 4 }}>
                        <span style={{ color: "#5A5347", fontSize: 12 }}>${m.spent}M / ${m.budget}M</span>
                        {m.revenue > 0 && <span style={{ color: "#3BA55C", fontSize: 12 }}>+${m.revenue}M revenue</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                      <motion.button whileHover={{ scale: 1.06, backgroundColor: "rgba(214,198,170,0.08)" }} whileTap={{ scale: 0.94 }} onClick={() => store.setEditingMovie({ ...m })} style={{ ...S.btnG, padding: "5px 10px", fontSize: 12 }}>Edit</motion.button>
                      <motion.button whileHover={{ scale: 1.06, backgroundColor: "rgba(212,83,75,0.08)" }} whileTap={{ scale: 0.94 }} onClick={() => store.handleDeleteMovie(m.id)} style={{ ...S.btnG, padding: "5px 10px", fontSize: 12, color: "#D4534B", borderColor: "rgba(212,83,75,0.2)" }}>✕</motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Activity feed */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 style={{ ...S.h3, marginBottom: 14 }}>Activity Feed</h3>
            <div style={{ background: "rgba(28,25,21,0.7)", border: "1px solid rgba(214,198,170,0.05)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 4, maxHeight: 520, overflow: "auto" }}>
              <AnimatePresence>
                {store.activities.map((a, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20, height: 0 }} 
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      height: "auto",
                      backgroundColor: i === 0 ? "rgba(214,198,170,0.06)" : "rgba(0,0,0,0)",
                    }} 
                    transition={{ 
                      duration: 0.35, 
                      delay: i * 0.04,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    key={a.id} 
                    style={{ padding: "10px 12px", borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}
                    whileHover={{ backgroundColor: "rgba(214,198,170,0.04)", x: 3 }}
                  >
                    <motion.span 
                      style={{ fontSize: 16, marginTop: 1 }}
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.04 + 0.15, type: "spring", stiffness: 400, damping: 12 }}
                    >
                      {a.icon}
                    </motion.span>
                    <div>
                      <div style={{ color: "#D6C6AA", fontSize: 13, lineHeight: 1.5 }}>
                        <strong style={{ color: "#B5A88E" }}>{a.user}</strong> {a.action} <strong style={{ color: "#B5A88E" }}>{a.target}</strong>
                      </div>
                      <span style={{ color: "#5A5347", fontSize: 11 }}>{a.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Selected movie detail */}
        <AnimatePresence>
          {store.selectedMovie && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }} 
              animate={{ opacity: 1, height: "auto", y: 0 }} 
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: "rgba(28,25,21,0.97)", border: "1px solid rgba(214,198,170,0.1)", borderRadius: 14, padding: 26, overflowX: "hidden" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <motion.span layoutId={`poster-${store.selectedMovie.id}`} style={{ fontSize: 40 }}>{store.selectedMovie.poster}</motion.span>
                  <div>
                    <h3 style={{ ...S.h3, fontSize: 24 }}>{store.selectedMovie.title}</h3>
                    <span style={{ color: "#7A7062", fontSize: 13 }}>{store.selectedMovie.genre} · ${store.selectedMovie.budget}M · Step {store.selectedMovie.promoStep}/9</span>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => store.setSelectedMovie(null)} style={S.btnG}>Close</motion.button>
              </div>
              <div className="dash-detail-grid">
              <div>
                <div style={S.label}>Budget Used</div>
                <MiniBar value={store.selectedMovie.spent} max={store.selectedMovie.budget} color="#D4903B" h={10} />
                <span style={{ color: "#D6C6AA", fontSize: 26, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 700, marginTop: 8, display: "block" }}>{((store.selectedMovie.spent / store.selectedMovie.budget) * 100).toFixed(0)}%</span>
                <span style={{ color: "#5A5347", fontSize: 12 }}>${store.selectedMovie.spent}M of ${store.selectedMovie.budget}M</span>
              </div>
              <div>
                <div style={S.label}>Gender Split</div>
                {Object.entries(store.selectedMovie.audience).map(([k, v], i) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: (["#4A90D9", "#D4534B", "#3BA55C"] as string[])[i], fontSize: 12, width: 42 }}>{k}</span>
                    <MiniBar value={v} max={100} color={(["#4A90D9", "#D4534B", "#3BA55C"] as string[])[i]!} h={6} />
                    <span style={{ color: "#D6C6AA", fontSize: 12 }}>{v}%</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={S.label}>Age Groups</div>
                {Object.entries(store.selectedMovie.ageGroups).map(([age, pct]) => (
                  <div key={age} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: "#7A7062", fontSize: 12, width: 36 }}>{age}</span>
                    <MiniBar value={pct} max={50} color="#8E5BB5" h={6} />
                    <span style={{ color: "#D6C6AA", fontSize: 12 }}>{pct}%</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={S.label}>Campaign ROI</div>
                {[
                  { l: "Social", s: store.selectedMovie.campaignSpend.social, r: `${(store.selectedMovie.campaignResults.social / 1000).toFixed(0)}K reach`, c: "#2BA5A5" },
                  { l: "Press", s: store.selectedMovie.campaignSpend.press, r: `${store.selectedMovie.campaignResults.press} pieces`, c: "#4A90D9" },
                  { l: "Digital", s: store.selectedMovie.campaignSpend.digital, r: `${(store.selectedMovie.campaignResults.digital / 1000000).toFixed(1)}M impr.`, c: "#8E5BB5" },
                  { l: "Events", s: store.selectedMovie.campaignSpend.events, r: `${store.selectedMovie.campaignResults.events} events`, c: "#D4903B" },
                ].map(c => (
                  <div key={c.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
                    <span style={{ color: c.c, fontSize: 12 }}>{c.l}</span>
                    <span style={{ color: "#5A5347", fontSize: 12 }}>${c.s}M</span>
                    <span style={{ color: "#D6C6AA", fontSize: 12 }}>{c.r}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Collaboration notes */}
        <div style={S.card}>
          <div className="dash-collab-header">
            <h3 style={S.h3}>Collaboration Notes</h3>
            <select value={store.commentMovie} onChange={e => store.setCommentMovie(e.target.value)} style={{ ...S.input, width: "auto", padding: "6px 12px", fontSize: 13 }}>
              {store.movies.map(m => <option key={m.id} value={m.title}>{m.poster} {m.title}</option>)}
            </select>
          </div>
          <div className="dash-collab-input">
            <input value={store.newComment} onChange={e => store.setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && store.addComment()} placeholder="Add a note or feedback..." style={{ ...S.input, flex: 1 }} />
            <RippleButton onClick={store.addComment} style={S.btnP}>Post</RippleButton>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {store.comments.filter(c => c.movie === store.commentMovie).map(c => (
              <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(214,198,170,0.05)", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong style={{ color: "#B5A88E", fontSize: 14 }}>{c.user}</strong>
                  <span style={{ color: "#5A5347", fontSize: 12 }}>{c.time}</span>
                </div>
                <p style={{ color: "#D6C6AA", fontSize: 14, margin: "0 0 10px", lineHeight: 1.6 }}>{c.text}</p>
                {c.replies.map((r, ri) => (
                  <div key={ri} style={{ marginLeft: 18, paddingLeft: 12, borderLeft: "2px solid rgba(214,198,170,0.07)", marginBottom: 6 }}>
                    <strong style={{ color: "#B5A88E", fontSize: 13 }}>{r.user}</strong>
                    <span style={{ color: "#5A5347", fontSize: 11, marginLeft: 8 }}>{r.time}</span>
                    <p style={{ color: "#9A8E7E", fontSize: 13, margin: "4px 0 0" }}>{r.text}</p>
                  </div>
                ))}
                {store.showReply === c.id ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 10, marginLeft: 18, flexWrap: "wrap" }}>
                    <input value={store.replyText[c.id] ?? ""} onChange={e => store.setReplyText(p => ({ ...p, [c.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && store.addReply(c.id)} placeholder="Write a reply..." style={{ ...S.input, flex: 1, fontSize: 13, padding: "7px 12px", minWidth: 150 }} />
                    <button onClick={() => store.addReply(c.id)} style={{ ...S.btnP, padding: "7px 14px", fontSize: 13 }}>Reply</button>
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => store.setShowReply(c.id)} style={{ ...S.btnG, marginTop: 8, padding: "4px 12px", fontSize: 12 }}>↩ Reply</motion.button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Film Modal ── */}
      <ModalBox open={store.showMovieModal} onClose={() => store.setShowMovieModal(false)} title="New Film Project">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={S.label}>Poster</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(214,198,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, cursor: "pointer" }} onClick={() => store.setShowPosterPicker(p => !p)}>
                {store.newMovie.poster}
              </div>
              {store.showPosterPicker && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, background: "rgba(18,15,12,0.95)", border: "1px solid rgba(214,198,170,0.1)", borderRadius: 10, padding: 10 }}>
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
            style={{ position: "fixed", bottom: 24, right: 24, background: "rgba(28,25,21,0.97)", border: "1px solid rgba(212,83,75,0.3)", borderRadius: 10, padding: "12px 18px", color: "#D6C6AA", fontSize: 13, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: "calc(100vw - 48px)" }}
          >
            {store.toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
