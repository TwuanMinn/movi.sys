"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/stores/toast-store";

export function ToastRegion() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-4 py-3 shadow-[var(--shadow-lg)] min-w-[280px] max-w-[360px]"
          >
            <span
              className={
                t.type === "success"
                  ? "text-[var(--color-accent-green)] mt-0.5"
                  : t.type === "error"
                    ? "text-[var(--color-accent-danger)] mt-0.5"
                    : "text-[var(--color-accent-amber)] mt-0.5"
              }
            >
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "◆"}
            </span>
            <div className="flex-1 min-w-0">
              {t.title ? (
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t.title}</p>
              ) : null}
              <p className="text-sm text-[var(--color-text-secondary)] break-words">{t.message}</p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-xs"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
