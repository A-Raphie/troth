"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  indicator?: "positive" | "neutral" | "warning";
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  indicator,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        {indicator === "positive" && (
          <span className="size-2 rounded-full bg-[var(--status-success)]" />
        )}
      </div>

      <div className="text-2xl font-bold font-mono tracking-tight tabular-nums text-[var(--text-primary)]">
        {value}
      </div>

      {subtext && (
        <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
}
