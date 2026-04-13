"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalBoxProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export function ModalBox({ open, onClose, title, children, width = 560 }: ModalBoxProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 300,
              mass: 0.8,
            }}
            onClick={e => e.stopPropagation()}
            style={{ background: "#1C1915", border: "1px solid rgba(173,198,255,0.14)", borderRadius: 16, width, maxWidth: "min(92vw, 100% - 24px)", maxHeight: "90vh", overflow: "auto", padding: "clamp(16px, 4vw, 28px)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ margin: 0, color: "#e1e2eb", fontFamily: "var(--font-display, 'Manrope', serif)", fontSize: 22, fontWeight: 600, letterSpacing: 0.5 }}>
                {title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={onClose}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(173,198,255,0.1)", color: "#8b90a0", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </motion.button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
