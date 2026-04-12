import type { CSSProperties } from "react";

/** Shared inline-style tokens used across all studio tabs. */
export const S = {
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(214,198,170,0.1)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#D6C6AA",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.25s, box-shadow 0.25s, background-color 0.15s",
  } as CSSProperties,

  label: {
    color: "#7A7062",
    fontSize: 12,
    fontFamily: "inherit",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  } as CSSProperties,

  btnP: {
    background: "rgba(212,83,75,0.15)",
    border: "1px solid rgba(212,83,75,0.3)",
    color: "#D4534B",
    borderRadius: 8,
    padding: "9px 22px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
  } as CSSProperties,

  btnG: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(214,198,170,0.1)",
    color: "#7A7062",
    borderRadius: 8,
    padding: "9px 18px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
  } as CSSProperties,

  card: {
    background: "rgba(28,25,21,0.9)",
    border: "1px solid rgba(214,198,170,0.07)",
    borderRadius: 12,
    padding: 20,
    transition: "border-color 0.25s, box-shadow 0.3s, transform 0.25s",
  } as CSSProperties,

  h3: {
    color: "#D6C6AA",
    fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
    fontSize: 22,
    margin: 0,
    fontWeight: 600,
  } as CSSProperties,
} as const;

export const PHASE_COLOR: Record<string, string> = {
  "Pre-Production": "#D4903B",
  "Production": "#D4534B",
  "Post-Production": "#8E5BB5",
  "Marketing": "#4A90D9",
  "Release": "#3BA55C",
  "Post-Release": "#2BA5A5",
};

export const STATUS_COLOR: Record<string, string> = {
  "Pre-Production": "#D4903B",
  "In Production": "#D4534B",
  "Post-Production": "#8E5BB5",
  "Released": "#3BA55C",
};

export const ASSET_STATUS_COLOR: Record<string, string> = {
  approved: "#3BA55C",
  pending: "#D4903B",
  in_review: "#4A90D9",
};

export const ASSET_ICON: Record<string, string> = {
  video: "🎬",
  image: "🖼️",
  document: "📄",
  archive: "📦",
};
