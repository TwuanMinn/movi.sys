"use client";

import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";

/**
 * @frontend-specialist: Login page — full-screen cinematic entrance.
 * @security-auditor: Google OAuth only, no password forms.
 * @mobile-developer: Centered card works on all viewports.
 */

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Background grain */}
      <div className="film-grain absolute inset-0" />

      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[oklch(0.65_0.18_30_/_0.05)] blur-[120px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 w-full max-w-sm border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-accent-primary)]"
          >
            CINEFORGE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-2 text-sm text-[var(--color-text-muted)]"
          >
            Internal Film Management System
          </motion.p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-subtle)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--color-bg-surface)] px-3 text-[var(--color-text-muted)]">
              Sign in with your studio account
            </span>
          </div>
        </div>

        {/* Google Sign-In */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() =>
            signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            })
          }
          className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all duration-[var(--duration-fast)] hover:border-[var(--color-accent-primary)] hover:shadow-[var(--shadow-glow)]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </motion.button>

        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          Only @cineforge.com accounts are permitted
        </p>
      </motion.div>
    </div>
  );
}
