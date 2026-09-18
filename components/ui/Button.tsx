"use client";
// Harvested from: https://beui.dev/r/button-base.json
// Re-expressed on semantic tokens

import React, { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";
import { SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  pressScale?: number;
  children?: React.ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 shadow-sm border border-transparent",
  secondary:
    "bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-default)] border border-[var(--border-default)]",
  outline:
    "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)]",
  ghost:
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-transparent",
  destructive:
    "bg-[var(--status-error-bg)] text-[var(--status-error)] hover:opacity-90 border border-[var(--status-error)]/30",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl font-medium",
  icon: "h-9 w-9 rounded-lg p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      pressScale = 0.96,
      className,
      disabled,
      children,
      ...rest
    },
    ref
  ) {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={isDisabled}
        whileTap={reduce || isDisabled ? undefined : { scale: pressScale }}
        whileHover={reduce || isDisabled || !canHover ? undefined : { scale: 1.015 }}
        transition={SPRING_PRESS}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none cursor-pointer",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_CLASS[variant],
          SIZE_CLASS[size],
          className
        )}
        {...rest}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        )}
        {children}
      </motion.button>
    );
  }
);
