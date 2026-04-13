import { useState, useMemo } from "react";
import type { Movie, User, Asset } from "@/lib/studio-types";

interface Props {
  open: boolean;
  onClose: () => void;
  movies: Movie[];
  users: User[];
  assets: Asset[];
  onSelectMovie: (m: Movie) => void;
  onNavigateTab: (tab: string) => void;
}

export function SearchModal({ open, onClose, movies, users, assets, onSelectMovie, onNavigateTab }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { movies: [], users: [], assets: [] };
    const q = query.toLowerCase();
    return {
      movies: movies.filter(m => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q) || m.status.toLowerCase().includes(q)),
      users: users.filter(u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
      assets: assets.filter(a => a.name.toLowerCase().includes(q) || a.movie.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)),
    };
  }, [query, movies, users, assets]);

  const totalResults = results.movies.length + results.users.length + results.assets.length;

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1100, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 600, maxWidth: "calc(100vw - 32px)", background: "rgba(18,15,12,0.98)", border: "1px solid rgba(173,198,255,0.14)", borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.6)", overflow: "hidden", animation: "slideUp .2s ease" }}>
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px", borderBottom: "1px solid rgba(173,198,255,0.08)" }}>
          <span style={{ color: "#414755", fontSize: 18 }}>🔍</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search films, team members, assets..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e1e2eb", fontSize: 16, fontFamily: "inherit" }}
          />
          <kbd style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(173,198,255,0.08)", borderRadius: 5, color: "#414755", fontSize: 10, padding: "3px 6px", fontFamily: "inherit" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflow: "auto", padding: "8px 0" }}>
          {query.trim() === "" ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ color: "#414755", fontSize: 14, marginBottom: 8 }}>Quick Navigation</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Dashboard", tab: "Dashboard", icon: "📊" },
                  { label: "Analytics", tab: "Analytics", icon: "📈" },
                  { label: "Promotion", tab: "Promotion", icon: "📣" },
                  { label: "Calendar", tab: "Calendar", icon: "📅" },
                  { label: "Assets", tab: "Assets", icon: "📁" },
                  { label: "Team", tab: "Team", icon: "👥" },
                  { label: "Reports", tab: "Reports", icon: "📋" },
                  { label: "Settings", tab: "Settings", icon: "⚙️" },
                ].map(item => (
                  <button key={item.tab} onClick={() => { onNavigateTab(item.tab); onClose(); }} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(173,198,255,0.06)", borderRadius: 8,
                    padding: "8px 14px", color: "#8b90a0", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 6, transition: "all .15s ease",
                  }}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#414755", fontSize: 14 }}>No results for &quot;{query}&quot;</div>
          ) : (
            <>
              {results.movies.length > 0 && (
                <div>
                  <div style={{ padding: "8px 20px 4px", color: "#414755", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Films ({results.movies.length})</div>
                  {results.movies.map(m => (
                    <button key={m.id} onClick={() => { onSelectMovie(m); onNavigateTab("Dashboard"); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                      <span style={{ fontSize: 20 }}>{m.poster}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#e1e2eb", fontSize: 14 }}>{m.title}</div>
                        <div style={{ color: "#414755", fontSize: 12 }}>{m.genre} · {m.status}</div>
                      </div>
                      <span style={{ color: "#3A362F", fontSize: 11 }}>${m.budget}M</span>
                    </button>
                  ))}
                </div>
              )}
              {results.users.length > 0 && (
                <div>
                  <div style={{ padding: "8px 20px 4px", color: "#414755", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Team ({results.users.length})</div>
                  {results.users.map(u => (
                    <button key={u.id} onClick={() => { onNavigateTab("Team"); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                      <span style={{ fontSize: 16, width: 32, height: 32, borderRadius: "50%", background: "rgba(212,83,75,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>{u.avatar}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#e1e2eb", fontSize: 14 }}>{u.name}</div>
                        <div style={{ color: "#414755", fontSize: 12 }}>{u.role}</div>
                      </div>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: u.active ? "#82dab0" : "#414755" }} />
                    </button>
                  ))}
                </div>
              )}
              {results.assets.length > 0 && (
                <div>
                  <div style={{ padding: "8px 20px 4px", color: "#414755", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" }}>Assets ({results.assets.length})</div>
                  {results.assets.map(a => (
                    <button key={a.id} onClick={() => { onNavigateTab("Assets"); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                      <span style={{ fontSize: 16 }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#e1e2eb", fontSize: 14 }}>{a.name}</div>
                        <div style={{ color: "#414755", fontSize: 12 }}>{a.movie} · {a.type}</div>
                      </div>
                      <span style={{ color: "#8b90a0", fontSize: 11 }}>{a.size}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(173,198,255,0.06)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#3A362F", fontSize: 11 }}>
            {totalResults > 0 ? `${totalResults} result${totalResults !== 1 ? "s" : ""}` : "Type to search"}
          </span>
          <span style={{ color: "#3A362F", fontSize: 11 }}>↵ to select · esc to close</span>
        </div>
      </div>
    </div>
  );
}
