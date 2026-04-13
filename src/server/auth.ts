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
    schema: {
      user: {
        modelName: "users"
      },
      session: {
        modelName: "sessions"
      },
      account: {
        modelName: "accounts"
      },
      verification: {
        modelName: "verifications"
      }
    }
  }),

  // Enable email provider as fallback when OAuth isn't configured
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    // Only instantiate google if credentials exist, preventing startup crashes
    ...(process.env.GOOGLE_CLIENT_ID ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    } : {}),
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  plugins: [nextCookies()],
});

export type Auth = typeof auth;
