import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-xs font-medium tracking-wider uppercase text-[var(--color-text-muted)]"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-9 w-full rounded-[var(--radius-sm)] border bg-[var(--color-bg-surface)] px-3 text-sm",
          "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
          "transition-colors duration-[var(--duration-fast)]",
          "focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)]/30",
          error
            ? "border-[var(--color-accent-danger)]"
            : "border-[var(--color-border-default)] hover:border-[var(--color-border-accent)]",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[var(--color-accent-danger)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
