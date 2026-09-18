"use client";
// Harvested from: https://beui.dev/components/motion/tilt-card.md & coss.com/ui/card
// Re-expressed on semantic tokens

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: "base" | "surface" | "subtle";
  interactive?: boolean;
}

export function Card({
  className,
  level = "surface",
  interactive = false,
  children,
  ...props
}: CardProps) {
  const levelStyles = {
    base: "bg-[var(--bg-base)] border-[var(--border-default)]",
    surface:
      "bg-[var(--bg-surface)] border-[var(--border-default)] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]",
    subtle: "bg-[var(--bg-subtle)] border-[var(--border-default)]",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border p-6 transition-colors duration-150",
        levelStyles[level],
        interactive &&
          "hover:border-[var(--border-strong)] hover:shadow-sm cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
