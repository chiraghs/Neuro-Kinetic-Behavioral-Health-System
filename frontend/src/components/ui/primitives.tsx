"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/* ─────────────────────────────── Button ─────────────────────────────── */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success" | "agent";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong shadow-[0_0_0_1px_rgba(76,141,255,0.4),0_6px_20px_-8px_rgba(76,141,255,0.6)]",
  secondary: "bg-surface-2 text-ink hover:bg-surface-3 border border-line",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
  outline: "border border-line-strong text-ink hover:bg-surface-2",
  danger: "bg-critical/90 text-white hover:bg-critical",
  success: "bg-healthy/90 text-white hover:bg-healthy",
  agent: "bg-agent/15 text-agent-ink border border-agent/40 hover:bg-agent/25",
};

const sizeClass: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-9 px-3.5 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-[15px] gap-2 rounded-xl",
  icon: "h-8 w-8 rounded-lg",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none select-none",
          "focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-45",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

/* ──────────────────────────────── Badge ──────────────────────────────── */

export type Tone = "neutral" | "accent" | "healthy" | "warning" | "critical" | "offline" | "maint" | "agent";
const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-3/70 text-ink-2 border-line-strong",
  accent: "bg-accent/12 text-accent-ink border-accent/35",
  healthy: "bg-healthy/12 text-healthy-ink border-healthy/35",
  warning: "bg-warning/12 text-warning-ink border-warning/35",
  critical: "bg-critical/12 text-critical-ink border-critical/40",
  offline: "bg-offline/15 text-offline-ink border-offline/40",
  maint: "bg-maint/12 text-maint-ink border-maint/40",
  agent: "bg-agent/12 text-agent-ink border-agent/40",
};

export function Badge({ tone = "neutral", className, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] leading-none font-medium whitespace-nowrap",
        toneClass[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* ──────────────────────────────── Card ──────────────────────────────── */

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)] backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  icon,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-line/60", className)}>
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && <div className="mt-0.5 text-accent">{icon}</div>}
        <div className="min-w-0">
          <h3 className="text-[13.5px] font-semibold tracking-tight text-ink">{title}</h3>
          {description && <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-4", className)} {...props} />;
}
