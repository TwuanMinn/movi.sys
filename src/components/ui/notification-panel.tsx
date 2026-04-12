import type { Activity } from "@/lib/studio-types";

interface Props {
  open: boolean;
  onClose: () => void;
  activities: Activity[];
}

export function NotificationPanel({ open, onClose, activities }: Props) {
  if (!open) return null;

  const notifications = [
    { id: 1, type: "warning", title: "Budget Alert", desc: "Whispers in the Dark is at 91% budget utilization", time: "10m ago", read: false },
    { id: 2, type: "approval", title: "Asset Pending", desc: "Teaser Trailer Final.mp4 awaits your review", time: "25m ago", read: false },
    { id: 3, type: "milestone", title: "Milestone Approaching", desc: "Crimson Horizon — Press Kit Delivery in 4 days", time: "1h ago", read: false },
    { id: 4, type: "update", title: "Campaign Update", desc: "TikTok campaign reached 580K engagements", time: "2h ago", read: true },
    { id: 5, type: "team", title: "Team Activity", desc: "Elena Rossi uploaded new key art", time: "3h ago", read: true },
    { id: 6, type: "deal", title: "Deal Closed", desc: "Streaming deal finalized for The Last Encore", time: "1d ago", read: true },
  ];

  const typeIcon: Record<string, string> = {
    warning: "⚠️",
    approval: "✅",
    milestone: "🎯",
    update: "📊",
    team: "👤",
    deal: "🤝",
  };

  const typeColor: Record<string, string> = {
    warning: "#D4903B",
    approval: "#3BA55C",
    milestone: "#D4534B",
    update: "#4A90D9",
    team: "#8E5BB5",
    deal: "#2BA5A5",
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
      {/* Panel */}
      <div style={{
        position: "fixed", top: 60, right: 24, width: 380, maxWidth: "calc(100vw - 48px)", maxHeight: "calc(100vh - 100px)",
        background: "rgba(18,15,12,0.98)", border: "1px solid rgba(214,198,170,0.12)", borderRadius: 14,
        boxShadow: "0 16px 64px rgba(0,0,0,0.6)", zIndex: 999, overflow: "hidden",
        animation: "slideUp .25s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(214,198,170,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#D6C6AA", fontSize: 16, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 600 }}>Notifications</span>
            {unread > 0 && (
              <span style={{ background: "rgba(212,83,75,0.2)", color: "#D4534B", fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>{unread} new</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ background: "transparent", border: "none", color: "#5A5347", cursor: "pointer", fontSize: 12, fontFamily: "inherit", padding: "4px 8px" }}>Mark all read</button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(214,198,170,0.08)", color: "#7A7062", borderRadius: 6, width: 26, height: 26, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* List */}
        <div style={{ maxHeight: 420, overflow: "auto", padding: "6px 0" }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              padding: "12px 18px", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer",
              background: n.read ? "transparent" : "rgba(212,83,75,0.03)",
              borderLeft: n.read ? "3px solid transparent" : `3px solid ${typeColor[n.type]}`,
              transition: "background .15s ease",
            }}>
              <span style={{ fontSize: 16, marginTop: 1 }}>{typeIcon[n.type]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ color: n.read ? "#7A7062" : "#D6C6AA", fontSize: 13, fontWeight: n.read ? 400 : 600 }}>{n.title}</span>
                  <span style={{ color: "#3A362F", fontSize: 10, flexShrink: 0, marginLeft: 8 }}>{n.time}</span>
                </div>
                <div style={{ color: "#5A5347", fontSize: 12, lineHeight: 1.5 }}>{n.desc}</div>
              </div>
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: typeColor[n.type], flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(214,198,170,0.06)", textAlign: "center" }}>
          <span style={{ color: "#5A5347", fontSize: 12, cursor: "pointer" }}>View all notifications →</span>
        </div>
      </div>
    </>
  );
}
