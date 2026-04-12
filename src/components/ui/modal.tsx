"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, className, size = "md" }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
              "rounded-[var(--radius-md)] border border-[var(--color-border-default)]",
              "bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)]",
              sizeMap[size],
              className
            )}
          >
            {/* Header */}
            {(title ?? description) ? (
              <div className="border-b border-[var(--color-border-subtle)] px-6 py-4">
                {title ? (
                  <h2
                    id="modal-title"
                    className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-text-primary)]"
                  >
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
                ) : null}
              </div>
            ) : null}

            {/* Body */}
            <div className="px-6 py-5">{children}</div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]"
              aria-label="Close modal"
            >
              ✕
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
