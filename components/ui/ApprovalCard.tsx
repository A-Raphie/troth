"use client";
// Harvested from: https://beautifului.dev#approval-card
// Re-expressed on semantic tokens

import React from "react";
import { CheckCircle2, ExternalLink, Clock, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatUSDC } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface ApprovalCardProps {
  milestoneId: number | string;
  title: string;
  amount: number;
  deadline?: string;
  status: "pending" | "submitted" | "completed";
  deliverableUrl?: string;
  submittedAt?: number;
  reviewWindowDays?: number;
  isPayer?: boolean;
  isProcessing?: boolean;
  onApprove?: () => void;
  onRequestRevision?: () => void;
  onSubmitWork?: () => void;
  onAutoRelease?: () => void;
  className?: string;
}

export function ApprovalCard({
  milestoneId,
  title,
  amount,
  deadline,
  status,
  deliverableUrl,
  submittedAt,
  reviewWindowDays = 7,
  isPayer = false,
  isProcessing = false,
  onApprove,
  onRequestRevision,
  onSubmitWork,
  onAutoRelease,
  className,
}: ApprovalCardProps) {
  // Compute remaining review window
  const reviewWindowMs = reviewWindowDays * 24 * 60 * 60 * 1000;
  const elapsedMs = submittedAt ? Date.now() - submittedAt : 0;
  const remainingMs = Math.max(0, reviewWindowMs - elapsedMs);
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const isAutoReleaseReady = status === "submitted" && remainingMs <= 0;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5",
        "transition-colors duration-150 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]",
        status === "submitted" && "border-blue-500/30 bg-blue-500/[0.02]",
        status === "completed" && "border-emerald-500/30 bg-emerald-500/[0.02]",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-tertiary)]">
              #{milestoneId}
            </span>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              {title}
            </h4>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="font-mono font-medium text-[var(--text-primary)]">
              {formatUSDC(amount)}
            </span>
            {deadline && (
              <>
                <span className="text-[var(--border-strong)]">·</span>
                <span>Due {deadline}</span>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {status === "completed" && (
            <Badge status="success" size="sm">
              Released
            </Badge>
          )}
          {status === "submitted" && (
            <Badge status="info" size="sm">
              Under Review
            </Badge>
          )}
          {status === "pending" && (
            <Badge status="neutral" size="sm">
              Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Deliverable Proof Section (if submitted or completed) */}
      {deliverableUrl && (
        <div className="mt-3.5 pt-3.5 border-t border-[var(--border-default)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            <span className="truncate">Proof:</span>
            <a
              href={deliverableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[var(--accent)] hover:underline inline-flex items-center gap-1 truncate"
            >
              <span className="truncate">{deliverableUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          {status === "submitted" && (
            <div className="flex items-center gap-1 text-[var(--status-pending)] font-mono text-[11px] shrink-0 ml-2">
              <Clock className="w-3 h-3" />
              <span>
                {remainingDays > 0 ? `${remainingDays}d auto-release` : "Auto-release ready"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {status === "pending" && !isPayer && onSubmitWork && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onSubmitWork}
            isLoading={isProcessing}
          >
            Submit Work
          </Button>
        )}

        {status === "submitted" && isPayer && (
          <>
            {onRequestRevision && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onRequestRevision}
                disabled={isProcessing}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Request Revision
              </Button>
            )}
            {onApprove && (
              <Button
                size="sm"
                variant="primary"
                onClick={onApprove}
                isLoading={isProcessing}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Approve & Release {formatUSDC(amount)}
              </Button>
            )}
          </>
        )}

        {status === "submitted" && !isPayer && isAutoReleaseReady && onAutoRelease && (
          <Button
            size="sm"
            variant="primary"
            onClick={onAutoRelease}
            isLoading={isProcessing}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Trigger Auto-Release
          </Button>
        )}
      </div>
    </div>
  );
}
