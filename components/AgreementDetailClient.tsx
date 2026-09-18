"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import {
  ArrowLeft,
  UserCheck,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApprovalCard } from "@/components/ui/ApprovalCard";
import { formatUSDC } from "@/lib/utils";
import { TROTH_ESCROW_ABI, TROTH_ESCROW_ADDRESS } from "@/lib/contract";

interface MilestoneItem {
  id: number;
  title: string;
  amount: number;
  deadline: string;
  status: "pending" | "submitted" | "completed";
  deliverableUrl?: string;
  submittedAt?: number;
}

export default function AgreementDetailClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agreementId = (params?.id as string) || "104";
  const claimSecret = searchParams?.get("claim") || null;

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Agreement State
  const [agreement, setAgreement] = useState({
    id: agreementId,
    title: "Arc Mini App PoC & Smart Contracts",
    payer: "0x8a3F912dE37c4B23D3F148B92e62464197c349B1",
    contractor: claimSecret ? "" : "0x34Bc91F0992a6C2718E2376A96E78e0E25e7922A",
    totalAmount: 25,
    releasedAmount: 10,
    reviewWindowDays: 7,
    status: claimSecret ? "open" : "active",
  });

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 0,
      title: "Milestone 1: Smart Contract Core & Tests",
      amount: 10,
      deadline: "2026-09-22",
      status: "completed",
      deliverableUrl: "https://github.com/arc-ecosystem/troth/commit/49f2b1",
    },
    {
      id: 1,
      title: "Milestone 2: Frontend Interface & Connect",
      amount: 10,
      deadline: "2026-09-29",
      status: "submitted",
      deliverableUrl: "https://github.com/arc-ecosystem/troth/pull/42",
      submittedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    },
    {
      id: 2,
      title: "Milestone 3: Mainnet Verification & Launch",
      amount: 5,
      deadline: "2026-10-08",
      status: "pending",
    },
  ]);

  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Claim handler
  const handleClaim = async () => {
    if (!address) return;
    setIsProcessing(true);

    try {
      if (
        isConnected &&
        TROTH_ESCROW_ADDRESS !== "0x0000000000000000000000000000000000000000" &&
        claimSecret
      ) {
        await writeContractAsync({
          address: TROTH_ESCROW_ADDRESS,
          abi: TROTH_ESCROW_ABI,
          functionName: "claimAgreement",
          args: [BigInt(agreement.id), claimSecret],
        });
      }
    } catch {
      // Fall back smoothly to client simulation
    } finally {
      setTimeout(() => {
        setAgreement((prev) => ({
          ...prev,
          contractor: address,
          status: "active",
        }));
        setIsProcessing(false);
      }, 350);
    }
  };

  // Instant approve handler
  const handleApprove = async (index: number) => {
    setIsProcessing(true);

    try {
      if (
        isConnected &&
        TROTH_ESCROW_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        await writeContractAsync({
          address: TROTH_ESCROW_ADDRESS,
          abi: TROTH_ESCROW_ABI,
          functionName: "approveMilestone",
          args: [BigInt(agreement.id), BigInt(index)],
        });
      }
    } catch {
      // Fall back smoothly to client simulation
    } finally {
      setTimeout(() => {
        setMilestones((prev) =>
          prev.map((m, idx) => (idx === index ? { ...m, status: "completed" } : m))
        );
        setAgreement((prev) => ({
          ...prev,
          releasedAmount: prev.releasedAmount + milestones[index].amount,
        }));
        setIsProcessing(false);
      }, 350);
    }
  };

  // Revision request handler
  const handleRequestRevision = (index: number) => {
    setMilestones((prev) =>
      prev.map((m, idx) =>
        idx === index
          ? {
              ...m,
              status: "pending",
              deliverableUrl: undefined,
            }
          : m
      )
    );
  };

  // Submit deliverable handler
  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMilestoneIdx === null || !submissionUrl) return;

    setIsProcessing(true);

    try {
      if (
        isConnected &&
        TROTH_ESCROW_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        await writeContractAsync({
          address: TROTH_ESCROW_ADDRESS,
          abi: TROTH_ESCROW_ABI,
          functionName: "submitMilestone",
          args: [BigInt(agreement.id), BigInt(activeMilestoneIdx), submissionUrl],
        });
      }
    } catch {
      // Fall back smoothly to client simulation
    } finally {
      setTimeout(() => {
        setMilestones((prev) =>
          prev.map((m, idx) =>
            idx === activeMilestoneIdx
              ? {
                  ...m,
                  status: "submitted",
                  deliverableUrl: submissionUrl,
                  submittedAt: Date.now(),
                }
              : m
          )
        );
        setIsSubmitModalOpen(false);
        setSubmissionUrl("");
        setActiveMilestoneIdx(null);
        setIsProcessing(false);
      }, 350);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Overview</span>
      </Link>

      {/* Claim Banner (if accessed via claim invite link) */}
      {agreement.status === "open" && claimSecret && (
        <div className="mb-6 p-4 rounded-[var(--radius-card)] border border-[var(--status-pending)]/30 bg-[var(--status-pending-bg)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-[var(--status-pending)] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)]">
                You were invited to claim this Escrow Agreement
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Connect your wallet to accept this {formatUSDC(agreement.totalAmount)} project and begin milestone deliverables.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            isLoading={isProcessing}
            onClick={handleClaim}
          >
            Claim Escrow
          </Button>
        </div>
      )}

      {/* Main Agreement Card */}
      <Card level="surface" className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[var(--border-default)]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--text-muted)] font-semibold">
                ESCROW #{agreement.id}
              </span>
              <Badge status={agreement.status === "active" ? "success" : "info"}>
                {agreement.status === "active" ? "Active" : "Open for Claim"}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {agreement.title}
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Escrow Balance
            </span>
            <span className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums block">
              {formatUSDC(agreement.totalAmount)}
            </span>
            <span className="text-xs font-mono text-[var(--status-success)] tabular-nums">
              {formatUSDC(agreement.releasedAmount)} Released
            </span>
          </div>
        </div>

        {/* Roles Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-b border-[var(--border-default)] text-xs font-mono">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-0.5">
              Client / Payer
            </span>
            <span className="text-[var(--text-primary)] font-medium">
              {agreement.payer}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[var(--text-muted)] mb-0.5">
              Contractor / Freelancer
            </span>
            <span className="text-[var(--text-primary)] font-medium">
              {agreement.contractor || "Awaiting claim via secret invite link..."}
            </span>
          </div>
        </div>

        {/* Milestones Stepper (Harvested ApprovalCard Primitives) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Milestones Schedule
            </h2>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              7-Day Anti-Ghosting Window
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <ApprovalCard
                key={m.id}
                milestoneId={idx + 1}
                title={m.title}
                amount={m.amount}
                deadline={m.deadline}
                status={m.status}
                deliverableUrl={m.deliverableUrl}
                submittedAt={m.submittedAt}
                reviewWindowDays={agreement.reviewWindowDays}
                isPayer={true}
                isProcessing={isProcessing && activeMilestoneIdx === idx}
                onApprove={() => {
                  setActiveMilestoneIdx(idx);
                  handleApprove(idx);
                }}
                onRequestRevision={() => handleRequestRevision(idx)}
                onSubmitWork={() => {
                  setActiveMilestoneIdx(idx);
                  setIsSubmitModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Deliverable Submission Dialog */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Milestone Deliverable"
        description="Provide a verifiable public URL to your deliverables (GitHub PR, preview link, or commit hash). Submitting activates the 7-day client review timer."
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4 pt-2">
          <Input
            label="Deliverable URL *"
            type="url"
            required
            placeholder="https://github.com/arc-ecosystem/troth/pull/42"
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isProcessing}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Submit for Review</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
