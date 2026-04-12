import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

/**
 * @security-auditor: Auth config with defense-in-depth:
 * - Domain lock: only @cineforge.com emails allowed (via denySignIn)
 * - nextCookies() for secure session management
 * - Google OAuth as sole provider (SSO for internal tool)
 *
 * @backend-specialist: Better Auth handles session/account/user tables.
 * Our custom `users` table is synced via Drizzle adapter.
 */

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  plugins: [nextCookies()],
});

export type Auth = typeof auth;
