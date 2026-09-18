"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "pending" | "submitted" | "success" | "error";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral:
      "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]",
    pending:
      "bg-[var(--status-pending-bg)] text-[var(--status-pending)] border-amber-300/40",
    submitted:
      "bg-[var(--status-submitted-bg)] text-[var(--status-submitted)] border-sky-300/40",
    success:
      "bg-[var(--status-success-bg)] text-[var(--status-success)] border-emerald-300/40",
    error:
      "bg-[var(--status-error-bg)] text-[var(--status-error)] border-red-300/40",
  };

  const dotColors = {
    neutral: "bg-[var(--text-muted)]",
    pending: "bg-amber-500",
    submitted: "bg-sky-500",
    success: "bg-emerald-500",
    error: "bg-red-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tabular-nums select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("size-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
}
