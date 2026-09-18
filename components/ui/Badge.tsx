"use client";
// Harvested from: https://beui.dev/r/animated-badge.json
// Re-expressed on semantic tokens

import React from "react";
import {
  AlertTriangle,
  Check,
  Circle,
  Info,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type BadgeStatus =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "loading"
  | "pending";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends Omit<HTMLMotionProps<"span">, "children"> {
  status?: BadgeStatus;
  variant?: BadgeStatus;
  size?: BadgeSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  pulse?: boolean;
}

const STATUS_CLASS: Record<BadgeStatus, string> = {
  neutral:
    "border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]",
  info:
    "border-[var(--status-pending)]/30 bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
  pending:
    "border-[var(--status-pending)]/30 bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
  success:
    "border-[var(--status-success)]/30 bg-[var(--status-success-bg)] text-[var(--status-success)]",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger:
    "border-[var(--status-error)]/30 bg-[var(--status-error-bg)] text-[var(--status-error)]",
  loading:
    "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--text-primary)]",
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  sm: "h-5 gap-1 px-2 text-[10.5px]",
  md: "h-6 gap-1.5 px-2.5 text-xs",
};

const ICON_CLASS: Record<BadgeSize, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
};

const ICONS: Record<BadgeStatus, LucideIcon> = {
  neutral: Circle,
  info: Info,
  pending: Info,
  success: Check,
  warning: AlertTriangle,
  danger: X,
  loading: Loader2,
};

const ICON_ROLL_VARIANTS: Variants = {
  initial: {
    opacity: 0.7,
    y: "70%",
    scale: 0.9,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: "0%",
    scale: 1,
    filter: "blur(0px)",
    transition: {
      y: { type: "spring", stiffness: 220, damping: 22 },
      opacity: { duration: 0.25, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0.4,
    y: "-70%",
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

export function Badge({
  status,
  variant,
  size = "md",
  children,
  icon,
  showIcon = true,
  pulse,
  className,
  ...rest
}: BadgeProps) {
  const activeStatus: BadgeStatus = status || variant || "neutral";
  const reduce = useReducedMotion();
  const Icon = ICONS[activeStatus];
  const isPulsing = pulse ?? activeStatus === "loading";

  return (
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full border font-medium tabular-nums",
        "transition-colors duration-200",
        STATUS_CLASS[activeStatus],
        SIZE_CLASS[size],
        className
      )}
      {...rest}
    >
      {isPulsing && !reduce ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-current opacity-10"
          animate={{ scale: [0.96, 1.08, 0.96], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      {showIcon ? (
        <span className="relative z-10 inline-flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={activeStatus}
              aria-hidden
              variants={ICON_ROLL_VARIANTS}
              initial={reduce ? false : "initial"}
              animate={reduce ? { opacity: 1 } : "animate"}
              exit={reduce ? undefined : "exit"}
              className="inline-flex"
            >
              {activeStatus === "loading" && !reduce && !icon ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-flex"
                >
                  <Icon className={ICON_CLASS[size]} />
                </motion.span>
              ) : (
                (icon ?? <Icon className={ICON_CLASS[size]} />)
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : null}

      {children != null ? (
        <span className="relative z-10 inline-flex font-mono">{children}</span>
      ) : null}
    </motion.span>
  );
}
