"use client";

import { useStudioStore } from "@/stores/studio-store";
import { motion } from "framer-motion";

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

const REVENUE_BARS = [
  { label: "Jan", bg: 40, fill: 70 },
  { label: "Feb", bg: 60, fill: 85 },
  { label: "Mar", bg: 85, fill: 95 },
  { label: "Apr", bg: 70, fill: 60 },
  { label: "May", bg: 95, fill: 100 },
  { label: "Jun", bg: 55, fill: 40 },
];

const TRANSACTIONS = [
  { id: 1, label: "Studio Rental – Hall A", date: "Apr 14, 2026", ref: "TR-9821", amount: -14500, icon: "payments", accent: "var(--color-accent-blue)" },
  { id: 2, label: "Streaming Advance", date: "Apr 12, 2026", ref: "TR-9700", amount: 250000, icon: "account_balance", accent: "#ffb595" },
  { id: 3, label: "Panavision Rentals", date: "Apr 10, 2026", ref: "TR-9654", amount: -8240, icon: "camera_roll", accent: "var(--color-accent-blue)" },
  { id: 4, label: "Payroll – Cineforge Crew", date: "Apr 09, 2026", ref: "TR-9601", amount: -112000, icon: "group", accent: "#ffb595" },
  { id: 5, label: "Asset Liquidation", date: "Apr 08, 2026", ref: "TR-9588", amount: 12400, icon: "inventory_2", accent: "#ffb595" },
];

export default function ReportsPage() {
  const { movies } = useStudioStore();

  const totalBudget = movies.reduce((s, m) => s + m.budget, 0);
  const pendingInvoices = 214800;
  const healthScore = 94;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]"
          >
            Finance Overview
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[var(--color-text-muted)] mt-1"
          >
            Q3 2026 Editorial Production & Revenue Performance
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--color-bg-elevated)] px-5 py-3 rounded-xl flex items-center gap-3"
        >
          <span className="text-sm font-medium text-[var(--color-text-muted)]">Production Balance</span>
          <span className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
            ${(totalBudget * 10000).toLocaleString()}.00
          </span>
        </motion.div>
      </div>

      {/* ── Financial Health Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Revenue Trends (2-col) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 bg-[var(--color-bg-surface)] p-6 lg:p-8 rounded-2xl border border-[var(--color-border-default)]/30"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">Revenue Trends</h3>
            <span className="text-xs font-bold text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 px-2.5 py-1 rounded-full uppercase tracking-tight">
              +12.4% vs LY
            </span>
          </div>
          {/* Bar Chart */}
          <div className="h-48 flex items-end gap-3 px-2">
            {REVENUE_BARS.map((bar, i) => (
              <div key={i} className="flex-1 relative group" style={{ height: `${bar.bg}%` }}>
                <div className="absolute inset-0 bg-[var(--color-bg-elevated)] rounded-t-lg" />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.fill}%` }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute bottom-0 w-full bg-[var(--color-accent-blue)] rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest px-2">
            {REVENUE_BARS.map((b) => <span key={b.label}>{b.label}</span>)}
          </div>
        </motion.div>

        {/* Pending Invoices Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[var(--color-accent-blue)] to-[#3a6fcc] p-6 lg:p-8 rounded-2xl shadow-xl shadow-[var(--color-accent-blue)]/15 text-white flex flex-col justify-between"
        >
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Pending Invoices</p>
            <h3 className="text-3xl lg:text-4xl font-extrabold font-[family-name:var(--font-display)]">
              ${pendingInvoices.toLocaleString()}
            </h3>
          </div>
          <div className="mt-5">
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white h-full rounded-full"
              />
            </div>
            <p className="text-[10px] mt-2 opacity-70 uppercase tracking-widest">14 invoices awaiting approval</p>
          </div>
        </motion.div>

        {/* Health Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--color-bg-surface)] p-6 lg:p-8 rounded-2xl border border-[var(--color-border-default)]/30 flex flex-col justify-between"
        >
          <div>
            <p className="text-[var(--color-text-muted)] text-sm font-medium mb-1">Health Score</p>
            <div className="flex items-center gap-2">
              <h3 className="text-4xl font-extrabold font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">{healthScore}</h3>
              <MI name="verified" className="text-2xl text-[var(--color-accent-blue)]" filled />
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-text-muted)]">Compliance</span>
              <span className="font-bold text-[var(--color-text-primary)]">100%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-text-muted)]">Burn Rate</span>
              <span className="font-bold text-[var(--color-text-primary)]">Stable</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Production Budgets + Transactions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Production Budgets */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--color-text-primary)]">
              Active Production Budgets
            </h2>
            <button className="text-[var(--color-accent-blue)] text-sm font-bold hover:underline">View All</button>
          </div>

          {movies.slice(0, 3).map((m, i) => {
            const pctUsed = m.budget > 0 ? Math.round((m.spent / m.budget) * 100) : 0;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="bg-[var(--color-bg-surface)] p-5 rounded-2xl border border-[var(--color-border-default)]/30 hover:border-[var(--color-accent-blue)]/15 hover:shadow-lg hover:shadow-[var(--color-accent-blue)]/5 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-2xl shrink-0">
                      {m.poster}
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-blue)] transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-sm text-[var(--color-text-muted)]">{m.status} · Due {m.releaseDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest mb-1">Budget Used</p>
                    <p className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-text-primary)]">
                      ${m.spent}M <span className="text-[var(--color-text-muted)] text-sm font-normal">/ ${m.budget}M</span>
                    </p>
                  </div>
                </div>
                <div className="relative w-full h-2 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctUsed}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                    className="absolute top-0 left-0 h-full bg-[var(--color-accent-blue)] rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <div className="flex gap-2">
                    {m.genre && (
                      <span className="px-2.5 py-0.5 bg-[var(--color-bg-elevated)] text-[10px] font-bold uppercase rounded-full text-[var(--color-text-muted)]">
                        {m.genre}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-muted)]">{pctUsed}% Exhausted</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border-default)]/30 overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--color-border-default)]/20">
            <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-[var(--color-border-default)]/10">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-bg-elevated)] transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${tx.accent}15` }}
                  >
                    <MI name={tx.icon} className="text-lg" style={{ color: tx.accent }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{tx.label}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-medium">{tx.date} · #{tx.ref}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${tx.amount > 0 ? "text-[var(--color-accent-blue)]" : "text-[#D4534B]"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}.00
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-[var(--color-bg-elevated)]/30 text-center">
            <button className="text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] transition-colors">
              Download Report (CSV)
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
