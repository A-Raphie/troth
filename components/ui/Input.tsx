"use client";
// Harvested from: https://ui.shadcn.com (input primitive)
// Re-expressed on semantic tokens

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] select-none"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={cn(
            "w-full px-3.5 py-2.5 rounded-[var(--radius-input)] border text-sm transition-colors duration-150",
            "bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "border-[var(--border-default)] hover:border-[var(--border-strong)]",
            "focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15",
            "disabled:opacity-50 disabled:bg-[var(--bg-subtle)] disabled:cursor-not-allowed",
            error &&
              "border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-[var(--status-error)]/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-[var(--status-error)]"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-[var(--text-muted)]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
