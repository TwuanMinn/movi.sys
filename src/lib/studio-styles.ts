import type { CSSProperties } from "react";

/**
 * Shared inline-style tokens used across all studio tabs.
 * Colors derived from CSS custom properties for theme adaptability.
 */
export const S = {
  input: {
    width: "100%",
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-default)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "var(--color-text-primary)",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.25s, box-shadow 0.25s, background-color 0.15s",
  } as CSSProperties,

  label: {
    color: "var(--color-text-muted)",
    fontSize: 12,
    fontFamily: "inherit",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  } as CSSProperties,

  btnP: {
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-accent)",
    color: "var(--color-accent-primary)",
    borderRadius: 8,
    padding: "9px 22px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
  } as CSSProperties,

  btnG: {
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-border-default)",
    color: "var(--color-text-muted)",
    borderRadius: 8,
    padding: "9px 18px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
  } as CSSProperties,

  card: {
    background: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-subtle)",
    borderRadius: 12,
    padding: 20,
    transition: "border-color 0.25s, box-shadow 0.3s, transform 0.25s, background-color 0.3s",
  } as CSSProperties,

  h3: {
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-display, 'Manrope', sans-serif)",
    fontSize: 22,
    margin: 0,
    fontWeight: 700,
  } as CSSProperties,
} as const;

export const PHASE_COLOR: Record<string, string> = {
  "Pre-Production": "#ffb595",
  "Production": "#4b8eff",
  "Post-Production": "#adc6ff",
  "Marketing": "#4b8eff",
  "Release": "#82dab0",
  "Post-Release": "#8b90a0",
};

export const STATUS_COLOR: Record<string, string> = {
  "Pre-Production": "#ffb595",
  "In Production": "#4b8eff",
  "Post-Production": "#adc6ff",
  "Released": "#82dab0",
};

export const ASSET_STATUS_COLOR: Record<string, string> = {
  approved: "#82dab0",
  pending: "#ffb595",
  in_review: "#4b8eff",
};

export const ASSET_ICON: Record<string, string> = {
  video: "🎬",
  image: "🖼️",
  document: "📄",
  archive: "📦",
};
