"use client";
// Harvested from: https://beui.dev/r/center-morph-modal.json
// Re-expressed on semantic tokens

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { EASE_OUT } from "@/lib/ease";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const CENTER_FOLDED_CLIP = "inset(48% 48% 48% 48% round 24px)";
const CENTER_OPEN_CLIP = "inset(0% 0% 0% 0% round 24px)";

const CENTER_UNFOLD_EASE = [0.2, 0, 0.2, 1] as const;
const CENTER_UNFOLD_TRANSITION = {
  duration: 0.38,
  ease: CENTER_UNFOLD_EASE,
} as const;

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <PresenceGate>
          {({ isPresent, gate }) => (
            <>
              {/* Backdrop */}
              <motion.div
                tabIndex={-1}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...gate}
                transition={{
                  duration: reduce ? 0.1 : 0.25,
                  ease: EASE_OUT,
                }}
                onClick={onClose}
                className="pointer-events-auto fixed inset-0 z-50 bg-black/40 backdrop-blur-xs cursor-default"
              />

              {/* Centered Modal Container */}
              <div
                inert={!isPresent}
                className="pointer-events-none fixed inset-4 z-50 flex items-center justify-center overflow-y-auto"
              >
                <div className="flex w-full flex-col items-center py-6">
                  <motion.div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "modal-title" : undefined}
                    aria-describedby={description ? "modal-desc" : undefined}
                    tabIndex={-1}
                    initial={
                      reduce
                        ? { opacity: 0, scale: 0.95 }
                        : { opacity: 1, clipPath: CENTER_FOLDED_CLIP }
                    }
                    animate={
                      reduce
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, clipPath: CENTER_OPEN_CLIP }
                    }
                    exit={
                      reduce
                        ? { opacity: 0, scale: 0.95 }
                        : { opacity: 1, clipPath: CENTER_FOLDED_CLIP }
                    }
                    {...gate}
                    transition={
                      reduce
                        ? { duration: 0.14, ease: EASE_OUT }
                        : CENTER_UNFOLD_TRANSITION
                    }
                    className={cn(
                      "pointer-events-auto relative w-full max-w-lg origin-center overflow-hidden",
                      "rounded-[var(--radius-card)] border border-[var(--border-default)]",
                      "bg-[var(--bg-overlay)] p-6 shadow-2xl will-change-[clip-path]",
                      className
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        {title && (
                          <h3
                            id="modal-title"
                            className="text-base font-semibold text-[var(--text-primary)]"
                          >
                            {title}
                          </h3>
                        )}
                        {description && (
                          <p
                            id="modal-desc"
                            className="text-xs text-[var(--text-secondary)] mt-1"
                          >
                            {description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="relative">{children}</div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </PresenceGate>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
