"use client";

import { useState } from "react";
import { S } from "@/lib/studio-styles";
import { useUIStore } from "@/stores/ui-store";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
      <span style={{ color: "var(--color-text-primary)", fontSize: 14 }}>{label}</span>
      <button
        type="button"
        onClick={onChange}
        style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: checked ? "rgba(59,165,92,0.3)" : "rgba(255,255,255,0.08)", position: "relative", transition: "background .2s ease" }}
      >
        <div style={{ width: 18, height: 18, borderRadius: "50%", position: "absolute", top: 3, left: checked ? 23 : 3, background: checked ? "#82dab0" : "#414755", transition: "left .2s ease, background .2s ease" }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  const [notifications, setNotifications] = useState({
    email: true, push: true, slack: false, weeklyDigest: true,
    budgetAlerts: true, assetApprovals: true, campaignUpdates: false, teamChanges: true,
  });
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  function handleSave() {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  }

  return (
    <>
      <style>{`
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .settings-section { display: flex; flex-direction: column; gap: 18px; }
        @media (max-width: 1023px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Profile */}
        <div style={S.card}>
          <h4 style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 18, margin: "0 0 18px" }}>Profile Settings</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(212,83,75,0.15)", border: "2px solid rgba(212,83,75,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#D4534B", flexShrink: 0 }}>SC</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "var(--color-text-primary)", fontSize: 20, fontFamily: "var(--font-display, 'Manrope', serif)", fontWeight: 600 }}>Sarah Chen</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 2 }}>Director · sarah@studio.com</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: 12, marginTop: 4 }}>Member since January 2024</div>
            </div>
            <button style={{ ...S.btnG, padding: "8px 16px" }}>Edit Profile</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={S.label}>Display Name</label><input defaultValue="Sarah Chen" style={S.input} /></div>
            <div><label style={S.label}>Email</label><input defaultValue="sarah@studio.com" style={S.input} /></div>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-section">
            <div style={S.card}>
              <h4 style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 16, margin: "0 0 14px" }}>Notification Channels</h4>
              <Toggle label="Email Notifications" checked={notifications.email} onChange={() => setNotifications(p => ({ ...p, email: !p.email }))} />
              <Toggle label="Push Notifications" checked={notifications.push} onChange={() => setNotifications(p => ({ ...p, push: !p.push }))} />
              <Toggle label="Slack Integration" checked={notifications.slack} onChange={() => setNotifications(p => ({ ...p, slack: !p.slack }))} />
              <Toggle label="Weekly Digest" checked={notifications.weeklyDigest} onChange={() => setNotifications(p => ({ ...p, weeklyDigest: !p.weeklyDigest }))} />
            </div>
            <div style={S.card}>
              <h4 style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 16, margin: "0 0 14px" }}>Alert Preferences</h4>
              <Toggle label="Budget Alerts" checked={notifications.budgetAlerts} onChange={() => setNotifications(p => ({ ...p, budgetAlerts: !p.budgetAlerts }))} />
              <Toggle label="Asset Approval Requests" checked={notifications.assetApprovals} onChange={() => setNotifications(p => ({ ...p, assetApprovals: !p.assetApprovals }))} />
              <Toggle label="Campaign Updates" checked={notifications.campaignUpdates} onChange={() => setNotifications(p => ({ ...p, campaignUpdates: !p.campaignUpdates }))} />
              <Toggle label="Team Member Changes" checked={notifications.teamChanges} onChange={() => setNotifications(p => ({ ...p, teamChanges: !p.teamChanges }))} />
            </div>
          </div>

          <div className="settings-section">
            <div style={S.card}>
              <h4 style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 16, margin: "0 0 14px" }}>Appearance</h4>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Theme</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {([{ id: "dark", label: "Dark", emoji: "🌙" }, { id: "light", label: "Light", emoji: "☀️" }, { id: "system", label: "System", emoji: "💻" }] as const).map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${theme === t.id ? "var(--color-border-accent)" : "var(--color-border-subtle)"}`, background: theme === t.id ? "rgba(42,98,212,0.1)" : "var(--color-bg-elevated)", color: theme === t.id ? "var(--color-accent-blue)" : "var(--color-text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s ease" }}>
                      <span>{t.emoji}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle label="Compact Mode" checked={compactMode} onChange={() => setCompactMode(p => !p)} />
              <Toggle label="Auto-save Changes" checked={autoSave} onChange={() => setAutoSave(p => !p)} />
            </div>
            <div style={S.card}>
              <h4 style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 16, margin: "0 0 14px" }}>Regional</h4>
              <div style={{ marginBottom: 12 }}><label style={S.label}>Timezone</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} style={S.input}>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">GMT / UTC</option>
                  <option value="Europe/Paris">Central European (CET)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}><label style={S.label}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={S.input}>
                  <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="JPY">JPY (¥)</option>
                </select>
              </div>
              <div><label style={S.label}>Date Format</label>
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={S.input}>
                  <option value="YYYY-MM-DD">2026-04-11</option><option value="MM/DD/YYYY">04/11/2026</option><option value="DD/MM/YYYY">11/04/2026</option><option value="MMM DD, YYYY">Apr 11, 2026</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div style={S.card}>
          <h4 style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 18, margin: "0 0 16px" }}>Integrations</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { name: "Slack", icon: "💬", connected: false, desc: "Team messaging" },
              { name: "Google Drive", icon: "📁", connected: true, desc: "File storage" },
              { name: "Frame.io", icon: "🎞️", connected: true, desc: "Video review" },
              { name: "Mailchimp", icon: "📧", connected: false, desc: "Email campaigns" },
              { name: "Hootsuite", icon: "📱", connected: false, desc: "Social scheduling" },
              { name: "Jira", icon: "📋", connected: true, desc: "Project tracking" },
            ].map(int => (
              <div key={int.name} style={{ background: "var(--color-bg-elevated)", border: `1px solid ${int.connected ? "var(--color-accent-green)" : "var(--color-border-subtle)"}`, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12, transition: "all 0.3s ease" }}>
                <span style={{ fontSize: 22 }}>{int.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--color-text-primary)", fontSize: 13, fontWeight: 600 }}>{int.name}</div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: 11 }}>{int.desc}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: int.connected ? "var(--color-accent-green)" : "var(--color-border-default)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div style={{ ...S.card, border: "1px solid rgba(212,83,75,0.15)" }}>
          <h4 style={{ color: "#D4534B", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 16, margin: "0 0 12px" }}>Danger Zone</h4>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ color: "var(--color-text-primary)", fontSize: 14 }}>Export All Data</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: 12 }}>Download a copy of all project data in JSON format</div>
            </div>
            <button style={{ ...S.btnG, color: "#D4903B", borderColor: "rgba(212,144,59,0.25)" }}>Export Data</button>
          </div>
          <div style={{ height: 1, background: "var(--color-border-subtle)", margin: "14px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ color: "var(--color-text-primary)", fontSize: 14 }}>Reset Studio</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: 12 }}>This will clear all local data and reset to defaults</div>
            </div>
            <button style={{ ...S.btnG, color: "#D4534B", borderColor: "rgba(212,83,75,0.25)" }}>Reset</button>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {showSaved && <span style={{ color: "#82dab0", fontSize: 14, display: "flex", alignItems: "center", gap: 6, animation: "slideUp .3s ease" }}>✓ Settings saved</span>}
          <button onClick={handleSave} style={{ ...S.btnP, padding: "12px 32px", fontSize: 15 }}>Save Settings</button>
        </div>
      </div>
    </>
  );
}
