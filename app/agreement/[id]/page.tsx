"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useTheme } from "@/context/ThemeContext";
import {
  ShieldCheck,
  Zap,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  FileCheck,
  Send,
  RotateCcw,
  UserCheck,
} from "lucide-react";

interface MilestoneItem {
  id: number;
  title: string;
  amount: number;
  deadline: string;
  status: "pending" | "submitted" | "completed";
  deliverableUrl?: string;
  submittedAt?: number;
}

export default function AgreementDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agreementId = params.id as string;
  const claimSecret = searchParams.get("claim");

  const { theme } = useTheme();
  const { address, isConnected } = useAccount();
  const isTerminal = theme === "terminal";

  // Simulated Agreement State
  const [agreement, setAgreement] = useState({
    id: agreementId || "104",
    title: "Full Stack dApp & Agentic Escrow",
    payer: "0x8a3F912dE37c4B23D3F148B92e62464197c349B1",
    contractor: claimSecret ? "" : "0x34Bc91F0992a6C2718E2376A96E78e0E25e7922A",
    totalAmount: 1500,
    releasedAmount: 500,
    reviewWindowDays: 7,
    status: claimSecret ? "open" : "active",
  });

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 0,
      title: "Milestone 1: Smart Contracts & Gas Abstraction",
      amount: 500,
      deadline: "2026-09-22",
      status: "completed",
      deliverableUrl: "https://github.com/arc-ecosystem/troth/commit/49f2b1",
    },
    {
      id: 1,
      title: "Milestone 2: Frontend & Dual-Theme System",
      amount: 600,
      deadline: "2026-09-29",
      status: "submitted",
      deliverableUrl: "https://github.com/arc-ecosystem/troth/pull/42",
      submittedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    },
    {
      id: 2,
      title: "Milestone 3: Mainnet Verification & Launch",
      amount: 400,
      deadline: "2026-10-08",
      status: "pending",
    },
  ]);

  // Submission modal state
  const [activeSubmissionMilestone, setActiveSubmissionMilestone] = useState<number | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Role detection
  const isPayer = !address || address.toLowerCase() === agreement.payer.toLowerCase();
  const isContractor = address && agreement.contractor && address.toLowerCase() === agreement.contractor.toLowerCase();

  // Claim handler
  const handleClaim = () => {
    if (!address) return;
    setIsProcessing(true);
    setTimeout(() => {
      setAgreement((prev) => ({
        ...prev,
        contractor: address,
        status: "active",
      }));
      setClaimSuccess(true);
      setIsProcessing(false);
    }, 350);
  };

  // Approval handler with sub-second animation
  const handleApprove = (index: number) => {
    setIsProcessing(true);
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
  };

  // Submit milestone deliverable
  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubmissionMilestone === null || !submissionUrl) return;

    setIsProcessing(true);
    setTimeout(() => {
      setMilestones((prev) =>
        prev.map((m, idx) =>
          idx === activeSubmissionMilestone
            ? {
                ...m,
                status: "submitted",
                deliverableUrl: submissionUrl,
                submittedAt: Date.now(),
              }
            : m
        )
      );
      setActiveSubmissionMilestone(null);
      setSubmissionUrl("");
      setIsProcessing(false);
    }, 350);
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${isTerminal ? "terminal-grid" : ""}`}>
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 hover:opacity-80 transition-opacity"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Overview</span>
      </Link>

      {/* Claim Banner (if accessed via invite link and unclaimed) */}
      {agreement.status === "open" && claimSecret && (
        <div
          className="mb-8 p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          style={{
            backgroundColor: "var(--status-submitted-bg)",
            borderColor: "var(--border-strong)",
            color: "var(--status-submitted-text)",
          }}
        >
          <div className="flex items-start gap-3">
            <UserCheck className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">You were invited to claim this Escrow Agreement</h3>
              <p className="text-xs mt-0.5 opacity-90">
                Connect your wallet to lock in as the designated contractor for this {agreement.totalAmount} USDC project.
              </p>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-all hover:scale-102"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--accent-text)",
            }}
          >
            {isProcessing ? "Binding Wallet..." : "Claim Escrow"}
          </button>
        </div>
      )}

      {/* Main Agreement Card */}
      <div
        className="rounded-2xl border p-6 sm:p-8 shadow-sm mb-8 transition-all"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-strong)",
        }}
      >
        {/* Agreement Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                ESCROW #{agreement.id}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                {agreement.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              {agreement.title}
            </h1>
          </div>

          {/* Balance breakdown */}
          <div className="text-right">
            <span className="text-xs font-mono uppercase" style={{ color: "var(--text-muted)" }}>
              Total Escrowed
            </span>
            <div className="text-2xl font-extrabold font-mono" style={{ color: "var(--text-primary)" }}>
              {agreement.totalAmount.toFixed(2)} USDC
            </div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {agreement.releasedAmount.toFixed(2)} USDC Released
            </div>
          </div>
        </div>

        {/* Roles Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b font-mono text-xs" style={{ borderColor: "var(--border-subtle)" }}>
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400">Payer (Client)</span>
            <span className="font-medium truncate block" style={{ color: "var(--text-primary)" }}>
              {agreement.payer}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400">Contractor (Freelancer)</span>
            <span className="font-medium truncate block" style={{ color: "var(--text-primary)" }}>
              {agreement.contractor || "Awaiting claim via link..."}
            </span>
          </div>
        </div>

        {/* Milestones List */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              Milestones Breakdown
            </h2>
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              7-Day Review Window Safeguard Active
            </span>
          </div>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor:
                    m.status === "submitted" ? "var(--accent-primary)" : "var(--border-subtle)",
                }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        m.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : m.status === "submitted"
                          ? "bg-cyan-500 text-white"
                          : "bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                      }`}
                    >
                      {m.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </span>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {m.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono pl-8" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                      {m.amount.toFixed(2)} USDC
                    </span>
                    <span>·</span>
                    <span>Deadline: {m.deadline}</span>

                    {m.deliverableUrl && (
                      <>
                        <span>·</span>
                        <a
                          href={m.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          <span>Deliverable Proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 pl-8 sm:pl-0">
                  {m.status === "completed" && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Released
                    </span>
                  )}

                  {m.status === "submitted" && (
                    <div className="flex flex-col sm:items-end gap-1.5">
                      <button
                        onClick={() => handleApprove(idx)}
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-102"
                        style={{
                          backgroundColor: "var(--accent-primary)",
                          color: "var(--accent-text)",
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isProcessing ? "Releasing (350ms)..." : "Approve & Release"}</span>
                      </button>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Auto-release in 5d 14h
                      </span>
                    </div>
                  )}

                  {m.status === "pending" && (
                    <button
                      onClick={() => setActiveSubmissionMilestone(idx)}
                      className="px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{
                        borderColor: "var(--border-strong)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Work</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverable Submission Modal */}
      {activeSubmissionMilestone !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 animate-scale-in"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-strong)",
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                Submit Milestone Deliverable
              </h3>
              <button
                onClick={() => setActiveSubmissionMilestone(null)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Provide a verifiable public link to your work (GitHub PR, Loom recording, preview deployment, or document).
              Submitting starts the client review clock.
            </p>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: "var(--text-secondary)" }}>
                  Deliverable URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/my-org/repo/pull/12"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmissionMilestone(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "var(--accent-text)",
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isProcessing ? "Submitting..." : "Submit Deliverable"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
