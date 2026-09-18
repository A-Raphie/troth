"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-[var(--radius-input)] border text-sm transition-all duration-150",
            "bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "border-[var(--border-default)] hover:border-[var(--border-strong)]",
            "focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10",
            "disabled:opacity-50 disabled:bg-[var(--bg-subtle)] disabled:cursor-not-allowed",
            error && "border-[var(--status-error)] focus:ring-[var(--status-error)]/10",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[var(--status-error)]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
