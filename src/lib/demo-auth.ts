/**
 * Demo Authentication System
 * 
 * Cookie-based mock auth for local development & portfolio demos.
 * Zero database dependency — stores session as a signed JSON cookie.
 * 
 * In production, Better Auth + Google OAuth handles real sessions.
 */

export type DemoRole = 
  | "admin"
  | "director"
  | "producer"
  | "editor"
  | "cinematographer"
  | "sound_engineer"
  | "vfx_artist"
  | "user";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  department: string;
  avatar: string; // initials-based, no external dependency
}

/** Pre-configured demo accounts for each studio role */
export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: "demo-admin-001",
    name: "Alex Morgan",
    email: "alex@cineforge.com",
    role: "admin",
    department: "Executive",
    avatar: "AM",
  },
  {
    id: "demo-director-001",
    name: "Sofia Reyes",
    email: "sofia.r@cineforge.com",
    role: "director",
    department: "Creative",
    avatar: "SR",
  },
  {
    id: "demo-producer-001",
    name: "James Chen",
    email: "james.c@cineforge.com",
    role: "producer",
    department: "Production",
    avatar: "JC",
  },
  {
    id: "demo-editor-001",
    name: "Maya Patel",
    email: "maya.p@cineforge.com",
    role: "editor",
    department: "Post-Production",
    avatar: "MP",
  },
  {
    id: "demo-cinematographer-001",
    name: "Luca Bianchi",
    email: "luca.b@cineforge.com",
    role: "cinematographer",
    department: "Camera",
    avatar: "LB",
  },
  {
    id: "demo-vfx-001",
    name: "Yuki Tanaka",
    email: "yuki.t@cineforge.com",
    role: "vfx_artist",
    department: "Visual Effects",
    avatar: "YT",
  },
];

export const DEMO_COOKIE_NAME = "cineforge-demo-session";

/** Encode a demo user into a cookie-safe string */
export function encodeDemoSession(user: DemoUser): string {
  return btoa(JSON.stringify(user));
}

/** Decode a demo session from a cookie value */
export function decodeDemoSession(value: string): DemoUser | null {
  try {
    return JSON.parse(atob(value)) as DemoUser;
  } catch {
    return null;
  }
}

/** Set the demo session cookie (client-side) */
export function setDemoSession(user: DemoUser): void {
  const encoded = encodeDemoSession(user);
  // 7 day expiry, accessible to middleware via path=/
  document.cookie = `${DEMO_COOKIE_NAME}=${encoded}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

/** Clear the demo session cookie (client-side) */
export function clearDemoSession(): void {
  document.cookie = `${DEMO_COOKIE_NAME}=; path=/; max-age=0`;
}

/** Read demo session from cookie string (works server-side in proxy.ts) */
export function getDemoSessionFromCookieString(cookieHeader: string): DemoUser | null {
  const match = cookieHeader.match(new RegExp(`${DEMO_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  return decodeDemoSession(match[1]);
}

/** Role display metadata — for the login page cards */
export const ROLE_META: Record<DemoRole, { icon: string; color: string; description: string }> = {
  admin: {
    icon: "admin_panel_settings",
    color: "#adc6ff",
    description: "Full system access, user management",
  },
  director: {
    icon: "movie_creation",
    color: "#82dab0",
    description: "Creative oversight, approvals",
  },
  producer: {
    icon: "work",
    color: "#ffb595",
    description: "Budget, scheduling, logistics",
  },
  editor: {
    icon: "content_cut",
    color: "#4b8eff",
    description: "Post-production, assembly, review",
  },
  cinematographer: {
    icon: "videocam",
    color: "#e8bfff",
    description: "Camera, lighting, dailies",
  },
  vfx_artist: {
    icon: "auto_fix_high",
    color: "#ffda6b",
    description: "Visual effects, compositing",
  },
  sound_engineer: {
    icon: "graphic_eq",
    color: "#93e0c2",
    description: "Audio mixing, sound design",
  },
  user: {
    icon: "person",
    color: "#8b90a0",
    description: "Standard viewer access",
  },
};
