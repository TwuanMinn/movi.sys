"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses = {
  primary:
    "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] hover:brightness-110 border-transparent",
  secondary:
    "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-hover)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]",
  danger:
    "bg-[var(--color-accent-danger)] text-[var(--color-text-inverse)] hover:brightness-110 border-transparent",
};

const sizeClasses = {
  sm: "h-7 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-base gap-2.5",
};

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-sm)] border font-medium",
        "transition-all duration-[var(--duration-fast)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)] focus-visible:outline-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled ?? loading}
      {...(props as ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
}
