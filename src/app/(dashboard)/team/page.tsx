"use client";

import { useStudioStore } from "@/stores/studio-store";
import { ModalBox } from "@/components/ui/modal-box";
import { S } from "@/lib/studio-styles";
import { ROLES } from "@/lib/studio-data";

const ROLE_COLOR: Record<string, string> = {
  director: "#D4534B", producer: "#D4903B", marketing_lead: "#8E5BB5",
  distribution_mgr: "#3BA55C", pr_specialist: "#4A90D9", social_media_mgr: "#2BA5A5",
  analytics_lead: "#CF7A30", editor: "#7B4BAD",
};

export default function TeamPage() {
  const store = useStudioStore();
  const { users } = store;

  const roleGroups = ROLES.map(role => ({
    role,
    members: users.filter(u => u.role === role.id),
  })).filter(g => g.members.length > 0);

  return (
    <>
      <style>{`
        .users-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .users-header { display: flex; justify-content: space-between; align-items: center; }
        .users-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .users-dist-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        @media (max-width: 1023px) { .users-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 767px) { .users-grid { grid-template-columns: repeat(2, 1fr); } .users-header { flex-direction: column; align-items: flex-start; gap: 10px; } }
        @media (max-width: 639px) { .users-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="users-header">
          <div>
            <span style={{ color: "#D6C6AA", fontSize: 15 }}>{users.length} team members</span>
            <span style={{ color: "#5A5347", fontSize: 14, marginLeft: 8 }}>· {users.filter(u => u.active).length} active</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => store.setShowRoleInfo(true)} style={{ ...S.btnG, padding: "8px 16px" }}>Role Guide</button>
            <button onClick={() => store.setShowUserModal(true)} style={S.btnP}>+ Add Member</button>
          </div>
        </div>

        <div className="users-chips">
          {ROLES.map(role => {
            const count = users.filter(u => u.role === role.id).length;
            const clr = ROLE_COLOR[role.id] ?? "#7A7062";
            return (
              <div key={role.id} style={{ background: `${clr}10`, border: `1px solid ${clr}22`, borderRadius: 20, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{role.icon}</span>
                <span style={{ color: clr, fontSize: 12, fontWeight: 600 }}>{role.label}</span>
                <span style={{ color: "#5A5347", fontSize: 12 }}>·</span>
                <span style={{ color: "#7A7062", fontSize: 12 }}>{count}</span>
              </div>
            );
          })}
        </div>

        <div className="users-grid">
          {users.map((user) => {
            const role = ROLES.find(r => r.id === user.role);
            const clr = ROLE_COLOR[user.role] ?? "#7A7062";
            return (
              <div key={user.id} style={{ background: "rgba(28,25,21,0.9)", border: "1px solid rgba(214,198,170,0.07)", borderRadius: 12, padding: 18 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${clr}18`, border: `2px solid ${clr}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: clr, marginBottom: 12 }}>
                  {user.avatar}
                </div>
                <div style={{ color: "#D6C6AA", fontSize: 15, fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontWeight: 600, marginBottom: 3 }}>{user.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                  <span style={{ fontSize: 13 }}>{role?.icon}</span>
                  <span style={{ color: clr, fontSize: 12 }}>{role?.label ?? user.role}</span>
                </div>
                <div style={{ color: "#5A5347", fontSize: 12, marginBottom: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: user.active ? "#3BA55C" : "#5A5347" }} />
                    <span style={{ color: user.active ? "#3BA55C" : "#5A5347", fontSize: 12 }}>{user.active ? "Active" : "Inactive"}</span>
                  </div>
                  <span style={{ color: "#5A5347", fontSize: 11 }}>{user.lastActive}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Role distribution */}
        <div style={S.card}>
          <h4 style={{ color: "#D6C6AA", fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: 18, margin: "0 0 16px" }}>Department Distribution</h4>
          <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", gap: 1, marginBottom: 12 }}>
            {ROLES.map((role) => {
              const count = users.filter(u => u.role === role.id).length;
              const pct = users.length ? (count / users.length) * 100 : 0;
              const clr = ROLE_COLOR[role.id] ?? "#7A7062";
              return pct > 0 ? <div key={role.id} style={{ width: `${pct}%`, background: clr }} /> : null;
            })}
          </div>
          <div className="users-dist-legend">
            {roleGroups.map(({ role, members }) => {
              const clr = ROLE_COLOR[role.id] ?? "#7A7062";
              return (
                <span key={role.id} style={{ color: clr, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: clr, display: "inline-block" }} />
                  {role.label} ({members.length})
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      <ModalBox open={store.showUserModal} onClose={() => store.setShowUserModal(false)} title="Add Team Member" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={S.label}>Full Name</label>
            <input value={store.newUser.name} onChange={e => store.setNewUser(u => ({ ...u, name: e.target.value }))} placeholder="Name..." style={S.input} />
          </div>
          <div>
            <label style={S.label}>Email</label>
            <input type="email" value={store.newUser.email} onChange={e => store.setNewUser(u => ({ ...u, email: e.target.value }))} placeholder="email@studio.com" style={S.input} />
          </div>
          <div>
            <label style={S.label}>Role</label>
            <select value={store.newUser.role} onChange={e => store.setNewUser(u => ({ ...u, role: e.target.value }))} style={S.input}>
              {ROLES.map(r => <option key={r.id} value={r.id}>{r.icon} {r.label}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={store.handleAddUser} style={{ ...S.btnP, flex: 1 }}>Add Member</button>
            <button onClick={() => store.setShowUserModal(false)} style={{ ...S.btnG, flex: 1 }}>Cancel</button>
          </div>
        </div>
      </ModalBox>

      {/* ── Role Guide Modal ── */}
      <ModalBox open={store.showRoleInfo} onClose={() => store.setShowRoleInfo(false)} title="Role Permissions Guide" width={620}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {ROLES.map(role => (
            <div key={role.id} style={{ background: `${role.color}08`, border: `1px solid ${role.color}18`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{role.icon}</span>
                <span style={{ color: role.color, fontSize: 13, fontWeight: 600 }}>{role.label}</span>
              </div>
              <p style={{ color: "#9A8E7E", fontSize: 11, margin: "0 0 8px", lineHeight: 1.5 }}>{role.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {role.permissions.map(p => (
                  <span key={p} style={{ background: `${role.color}12`, color: role.color, fontSize: 9, padding: "1px 7px", borderRadius: 20 }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ModalBox>

      {store.toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "rgba(28,25,21,0.97)", border: "1px solid rgba(212,83,75,0.3)", borderRadius: 10, padding: "12px 18px", color: "#D6C6AA", fontSize: 13, zIndex: 9999, animation: "slideUp .3s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: "calc(100vw - 48px)" }}>
          {store.toast}
        </div>
      )}
    </>
  );
}
