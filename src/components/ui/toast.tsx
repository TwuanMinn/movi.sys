"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToastStore, type ToastType } from "@/stores/toast-store";
import { useEffect, useState } from "react";

const ICON_MAP: Record<ToastType, { icon: string; color: string; bg: string }> = {
  success: { icon: "check_circle", color: "var(--color-accent-green)", bg: "rgba(80,250,123,0.08)" },
  error:   { icon: "error",        color: "var(--color-accent-danger)", bg: "rgba(212,83,75,0.08)" },
  warning: { icon: "warning",      color: "var(--color-accent-amber)", bg: "rgba(241,250,140,0.08)" },
  info:    { icon: "info",         color: "var(--color-accent-blue)", bg: "rgba(139,233,253,0.08)" },
};

function ProgressBar({ duration, createdAt }: { duration: number; createdAt: number }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - createdAt;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [duration, createdAt]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04] overflow-hidden rounded-b-xl">
      <div
        className="h-full transition-none rounded-b-xl"
        style={{
          width: `${progress}%`,
          background: "currentColor",
          opacity: 0.3,
        }}
      />
    </div>
  );
}

export function ToastRegion() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2.5 pointer-events-none max-w-[400px]"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const meta = ICON_MAP[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 80, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative flex items-start gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
              style={{ color: meta.color }}
            >
              {/* Icon with colored bg */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: meta.bg }}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ color: meta.color }}>
                  {meta.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-0.5">
                    {t.title}
                  </p>
                )}
                <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed break-words">
                  {t.message}
                </p>
                {t.action && (
                  <button
                    onClick={() => { t.action!.onClick(); dismiss(t.id); }}
                    className="mt-1.5 text-[11px] font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
                    style={{ color: meta.color }}
                  >
                    {t.action.label}
                  </button>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={() => dismiss(t.id)}
                className="flex-shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-0.5"
                aria-label="Dismiss notification"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>

              {/* Progress bar */}
              {(t.duration ?? 4000) > 0 && (
                <ProgressBar duration={t.duration ?? 4000} createdAt={t.createdAt} />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
