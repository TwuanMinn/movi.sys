"use client";

import { useStudioStore } from "@/stores/studio-store";
import { ModalBox } from "@/components/ui/modal-box";
import { S } from "@/lib/studio-styles";
import { ROLES } from "@/lib/studio-data";
import { motion } from "framer-motion";
import { useState } from "react";

/** Material Symbol helper */
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

/** Maps role id → Material Symbol icon name */
const ROLE_ICON: Record<string, string> = {
  director: "videocam", producer: "work", marketing_lead: "campaign",
  distribution_mgr: "public", pr_specialist: "newspaper", social_media_mgr: "share",
  analytics_lead: "bar_chart", editor: "movie_edit",
};

/** Stitch M3 palette — role colors mapped to semantic blue/teal family */
const ROLE_COLOR: Record<string, string> = {
  director: "#4b8eff", producer: "#ffb595", marketing_lead: "#adc6ff",
  distribution_mgr: "#82dab0", pr_specialist: "#7eb8ff", social_media_mgr: "#5ec5c5",
  analytics_lead: "#f0a060", editor: "#b89eff",
};

/** Phone numbers for team members */
const PHONE_MAP: Record<number, string> = {
  1: "+1 (555) 012-3456", 2: "+1 (555) 234-5678", 3: "+1 (555) 345-6789",
  4: "+1 (555) 456-7890", 5: "+1 (555) 567-8901", 6: "+1 (555) 678-9012",
  7: "+1 (555) 789-0123", 8: "+1 (555) 890-1234",
};

export default function TeamPage() {
  const store = useStudioStore();
  const { users } = store;
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const filtered = filterRole ? users.filter((u) => u.role === filterRole) : users;
  const roleGroups = ROLES.map((role) => ({
    role,
    members: users.filter((u) => u.role === role.id),
  })).filter((g) => g.members.length > 0);

  return (
    <>
      <div className="px-6 lg:px-10 py-6 lg:py-8 flex flex-col gap-6">
        {/* ── Editorial Header ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Creative Team
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-1 text-base">
              Manage and collaborate with your film production crew.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => store.setShowRoleInfo(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <MI name="info" className="text-[18px]" />
              Role Guide
            </button>
            <button
              onClick={() => store.setShowUserModal(true)}
              className="flex items-center gap-2 bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-[var(--color-accent-blue)]/20 hover:scale-105 transition-transform"
            >
              <MI name="person_add" className="text-[18px]" />
              Add Member
            </button>
          </div>
        </section>

        {/* ── Role Filter Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilterRole(null)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              !filterRole
                ? "bg-[var(--color-accent-blue)] text-white"
                : "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
            }`}
          >
            All Roles
          </button>
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setFilterRole(filterRole === role.id ? null : role.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterRole === role.id
                  ? "bg-[var(--color-accent-blue)] text-white"
                  : "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* ── Team Grid ── */}
        <section className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map((user, i) => {
            const role = ROLES.find((r) => r.id === user.role);
            const clr = ROLE_COLOR[user.role] ?? "#8b90a0";
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border-default)]/30 hover:border-[var(--color-accent-blue)]/20 hover:shadow-lg hover:shadow-[var(--color-accent-blue)]/5 transition-all group overflow-hidden"
              >
                {/* Top section — Centered Avatar + Badge */}
                <div className="relative pt-8 pb-5 flex flex-col items-center">
                  {/* ACTIVE / AWAY badge — top right */}
                  <span
                    className="absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: user.active ? "rgba(130,218,176,0.12)" : "rgba(65,71,85,0.15)",
                      color: user.active ? "#82dab0" : "var(--color-text-muted)",
                    }}
                  >
                    {user.active ? "Active" : "Away"}
                  </span>

                  {/* Avatar circle */}
                  <div className="relative mb-5">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold ring-[3px]"
                      style={{
                        background: `${clr}15`,
                        color: clr,
                        boxShadow: `0 0 0 3px ${user.active ? "rgba(130,218,176,0.35)" : `${clr}25`}`,
                      }}
                    >
                      {user.avatar}
                    </div>
                    {/* Status dot */}
                    <div
                      className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full border-[3px] border-[var(--color-bg-surface)]"
                      style={{ background: user.active ? "#82dab0" : "var(--color-border-default)" }}
                    />
                  </div>

                  {/* Name */}
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)] text-center">
                    {user.name}
                  </h3>

                  {/* Role */}
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold" style={{ color: clr }}>
                    <MI name={ROLE_ICON[user.role] ?? "person"} className="text-[16px]" filled />
                    <span>{role?.label ?? user.role}</span>
                  </div>
                </div>

                {/* Divider + Contact Details */}
                <div className="mx-5 mb-5 pt-4 border-t border-[var(--color-border-default)]/15 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm">
                    <MI name="mail" className="text-[18px] text-[var(--color-text-muted)]" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm">
                    <MI name="call" className="text-[18px] text-[var(--color-text-muted)]" />
                    <span>{PHONE_MAP[user.id] ?? "+1 (555) 000-0000"}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* ── Department Distribution ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Horizontal Bar Chart */}
          <div className="lg:col-span-3 bg-[var(--color-bg-surface)] p-6 lg:p-8 rounded-2xl border border-[var(--color-border-default)]/30">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text-primary)] mb-6">
              Department Distribution
            </h3>
            <div className="space-y-4">
              {roleGroups.map(({ role, members }, i) => {
                const clr = ROLE_COLOR[role.id] ?? "#8b90a0";
                const pct = users.length > 0 ? (members.length / users.length) * 100 : 0;
                return (
                  <div key={role.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${clr}15` }}>
                          <MI name={ROLE_ICON[role.id] ?? "person"} className="text-[16px]" style={{ color: clr }} />
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{role.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: clr }}>
                        {members.length} <span className="text-[var(--color-text-muted)] font-normal text-xs">({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${clr}, ${clr}99)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workforce Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-5">
            {/* Total Count */}
            <div className="bg-gradient-to-br from-[var(--color-accent-blue)] to-[#3a6fcc] p-6 rounded-2xl text-white shadow-xl shadow-[var(--color-accent-blue)]/15 flex flex-col justify-between">
              <MI name="groups" className="text-3xl opacity-40" />
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Total Members</p>
                <p className="text-4xl font-extrabold mt-1">{users.length}</p>
              </div>
            </div>
            {/* Active / Departments */}
            <div className="bg-[var(--color-bg-surface)] p-6 rounded-2xl border border-[var(--color-border-default)]/30 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(130,218,176,0.1)] flex items-center justify-center">
                  <MI name="radio_button_checked" className="text-xl text-[#82dab0]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">{users.filter((u) => u.active).length}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Currently Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(75,142,255,0.1)] flex items-center justify-center">
                  <MI name="account_tree" className="text-xl text-[var(--color-accent-blue)]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">{roleGroups.length}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Departments</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Add User Modal ── */}
      <ModalBox open={store.showUserModal} onClose={() => store.setShowUserModal(false)} title="Add Team Member" width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={S.label}>Full Name</label>
            <input value={store.newUser.name} onChange={(e) => store.setNewUser((u) => ({ ...u, name: e.target.value }))} placeholder="Name..." style={S.input} />
          </div>
          <div>
            <label style={S.label}>Email</label>
            <input type="email" value={store.newUser.email} onChange={(e) => store.setNewUser((u) => ({ ...u, email: e.target.value }))} placeholder="email@studio.com" style={S.input} />
          </div>
          <div>
            <label style={S.label}>Role</label>
            <select value={store.newUser.role} onChange={(e) => store.setNewUser((u) => ({ ...u, role: e.target.value }))} style={S.input}>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={store.handleAddUser} style={{ ...S.btnP, flex: 1 }}>
              Add Member
            </button>
            <button onClick={() => store.setShowUserModal(false)} style={{ ...S.btnG, flex: 1 }}>
              Cancel
            </button>
          </div>
        </div>
      </ModalBox>

      {/* ── Role Guide Modal ── */}
      <ModalBox open={store.showRoleInfo} onClose={() => store.setShowRoleInfo(false)} title="Role Permissions Guide" width={620}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {ROLES.map((role) => {
            const clr = ROLE_COLOR[role.id] ?? role.color;
            return (
              <div key={role.id} style={{ background: `${clr}08`, border: `1px solid ${clr}18`, borderRadius: 12, padding: 14 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <MI name={ROLE_ICON[role.id] ?? "person"} className="text-[18px]" style={{ color: clr }} />
                  <span style={{ color: clr, fontSize: 13, fontWeight: 600 }}>{role.label}</span>
                </div>
                <p style={{ color: "#8b90a0", fontSize: 11, margin: "0 0 8px", lineHeight: 1.5 }}>{role.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((p) => (
                    <span key={p} style={{ background: `${clr}12`, color: clr, fontSize: 9, padding: "2px 8px", borderRadius: 20 }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ModalBox>

      {store.toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[var(--color-bg-surface)]/97 border border-[var(--color-border-default)] rounded-xl px-5 py-3 text-[var(--color-text-primary)] text-sm shadow-lg max-w-[calc(100vw-48px)] animate-[slideUp_0.3s_ease]">
          {store.toast}
        </div>
      )}
    </>
  );
}
