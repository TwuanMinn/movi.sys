import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "status" | "role";

interface BadgeProps {
  variant?: BadgeVariant;
  status?: "development" | "pre_production" | "production" | "post_production" | "released" | "cancelled";
  role?: "admin" | "director" | "producer" | "editor" | "crew" | "viewer";
  className?: string;
  children: React.ReactNode;
}

const statusColorMap: Record<string, string> = {
  development: "bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)] border-[var(--color-accent-blue)]/30",
  pre_production: "bg-[var(--color-accent-amber)]/15 text-[var(--color-accent-amber)] border-[var(--color-accent-amber)]/30",
  production: "bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/30",
  post_production: "bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] border-[var(--color-accent-green)]/30",
  released: "bg-[var(--color-text-muted)]/15 text-[var(--color-text-secondary)] border-[var(--color-border-default)]",
  cancelled: "bg-[var(--color-accent-danger)]/15 text-[var(--color-accent-danger)] border-[var(--color-accent-danger)]/30",
};

const roleColorMap: Record<string, string> = {
  admin: "bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/30",
  director: "bg-[var(--color-accent-amber)]/15 text-[var(--color-accent-amber)] border-[var(--color-accent-amber)]/30",
  producer: "bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)] border-[var(--color-accent-blue)]/30",
  editor: "bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] border-[var(--color-accent-green)]/30",
  crew: "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-default)]",
  viewer: "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]",
};

export function Badge({ variant = "default", status, role, className, children }: BadgeProps) {
  let colorClass = "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-default)]";

  if (variant === "status" && status) colorClass = statusColorMap[status] ?? colorClass;
  if (variant === "role" && role) colorClass = roleColorMap[role] ?? colorClass;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-xs)] border px-2 py-0.5 text-xs font-medium tracking-wide",
        colorClass,
        className
      )}
    >
      {children}
    </span>
  );
}
