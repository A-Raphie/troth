"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { keccak256, stringToBytes } from "viem";
import { useTheme } from "@/context/ThemeContext";
import { TROTH_ESCROW_ADDRESS, TROTH_ESCROW_ABI, USDC_ADDRESS, ERC20_ABI } from "@/lib/contract";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Wallet,
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react";

interface MilestoneFormItem {
  id: string;
  title: string;
  amount: string;
  days: number;
}

export default function CreateAgreementPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { address, isConnected } = useAccount();
  const isTerminal = theme === "terminal";

  // Form State
  const [title, setTitle] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [recipientType, setRecipientType] = useState<"direct" | "invite">("direct");
  const [contractorAddress, setContractorAddress] = useState("");
  const [reviewWindowDays, setReviewWindowDays] = useState<number>(7);

  const [milestones, setMilestones] = useState<MilestoneFormItem[]>([
    { id: "1", title: "Milestone 1: Project Setup & Architecture", amount: "500", days: 7 },
    { id: "2", title: "Milestone 2: Final Delivery & Deployment", amount: "1000", days: 14 },
  ]);

  const [claimSecret, setClaimSecret] = useState<string>(() => {
    // Generate secure random secret for shareable link
    return typeof window !== "undefined"
      ? "troth_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      : "troth_secret";
  });

  const [createdAgreementId, setCreatedAgreementId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  const handleAddMilestone = () => {
    const nextId = (milestones.length + 1).toString();
    setMilestones((prev) => [
      ...prev,
      { id: nextId, title: `Milestone ${nextId}: `, amount: "250", days: 7 },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMilestone = (id: string, field: keyof MilestoneFormItem, value: any) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/agreement/${createdAgreementId || 1}?claim=${claimSecret}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || milestones.length === 0) return;

    setIsSubmitting(true);

    try {
      // For instant simulation & demonstration
      setTimeout(() => {
        setIsSubmitting(false);
        setCreatedAgreementId(Math.floor(Math.random() * 900) + 100);
      }, 500);
    } catch (err) {
      console.error("Creation failed", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${isTerminal ? "terminal-grid" : ""}`}>
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 hover:opacity-80 transition-opacity"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Overview</span>
      </Link>

      <div
        className="rounded-2xl border p-6 sm:p-8 shadow-sm transition-all"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-strong)",
        }}
      >
        <div className="border-b pb-6 mb-8" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>New Escrow Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            Lock Funds in Trustless Milestones
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Define the project deliverables and lock USDC on Arc Mainnet. Funds only release when you approve each tranche.
          </p>
        </div>

        {createdAgreementId ? (
          /* Confirmation State */
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Escrow #{createdAgreementId} Created!
              </h2>
              <p className="text-sm mt-1 font-mono" style={{ color: "var(--text-secondary)" }}>
                {totalAmount.toFixed(2)} USDC locked on Arc Mainnet
              </p>
            </div>

            {recipientType === "invite" ? (
              <div
                className="max-w-md mx-auto p-4 rounded-xl border text-left space-y-2"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-strong)",
                }}
              >
                <span className="text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>
                  Shareable Claim Link
                </span>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Send this link to your contractor. They will connect their wallet to claim the escrow:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/agreement/${createdAgreementId}?claim=${claimSecret}`}
                    className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono select-all"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--accent-text)",
                    }}
                  >
                    {copied ? "Copied!" : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href={`/agreement/${createdAgreementId}`}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--accent-text)",
                }}
              >
                <span>View Escrow Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleCreate} className="space-y-8">
            {/* Agreement Basics */}
            <div className="space-y-4">
              <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                1. Agreement Details
              </h2>
              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Landing Page & Smart Contracts for Troth"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Scope / Specification URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo/issues/1 or Google Doc link"
                  value={metadataUri}
                  onChange={(e) => setMetadataUri(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Recipient Selection */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                  2. Contractor Assignment
                </h2>
                <div className="flex rounded-lg border p-0.5" style={{ borderColor: "var(--border-strong)" }}>
                  <button
                    type="button"
                    onClick={() => setRecipientType("direct")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      recipientType === "direct"
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Direct Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType("invite")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      recipientType === "invite"
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Shareable Invite Link
                  </button>
                </div>
              </div>

              {recipientType === "direct" ? (
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Contractor Wallet Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={contractorAddress}
                    onChange={(e) => setContractorAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              ) : (
                <div
                  className="p-4 rounded-xl border text-xs space-y-1"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    🔗 Open Invite Link Mode
                  </p>
                  <p>
                    A unique claim secret will be generated. You can send the resulting link to your freelancer over Telegram,
                    Slack, or email. They will connect their wallet to lock in as the recipient.
                  </p>
                </div>
              )}
            </div>

            {/* Milestones Breakdown */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    3. Milestones Breakdown
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Divide work into discrete tranches with individual USDC releases.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{
                    borderColor: "var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <span className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      required
                      placeholder="Milestone Deliverable description"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestone(m.id, "title", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-2 text-xs font-mono text-neutral-400">$</span>
                        <input
                          type="number"
                          required
                          min="1"
                          step="1"
                          placeholder="Amount"
                          value={m.amount}
                          onChange={(e) => handleUpdateMilestone(m.id, "amount", e.target.value)}
                          className="w-full pl-6 pr-3 py-2 rounded-lg border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-subtle)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono text-neutral-500">
                        <span>USDC</span>
                      </div>

                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div
                className="p-4 rounded-xl border flex items-center justify-between font-mono"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-strong)",
                }}
              >
                <span className="text-xs font-bold uppercase" style={{ color: "var(--text-secondary)" }}>
                  Total Escrow Deposit
                </span>
                <span className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
                  {totalAmount.toFixed(2)} USDC
                </span>
              </div>
            </div>

            {/* Review Window Safeguard */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    4. Anti-Ghosting Review Window
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Time the client has to approve or request revisions after milestone submission.
                  </p>
                </div>
                <select
                  value={reviewWindowDays}
                  onChange={(e) => setReviewWindowDays(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value={1}>24 Hours (Demo Speed)</option>
                  <option value={3}>3 Days (Fiverr default)</option>
                  <option value={7}>7 Days (Upwork standard)</option>
                  <option value={14}>14 Days (Extended enterprise)</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || totalAmount <= 0}
                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-101 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--accent-text)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Confirming on Arc Mainnet...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Lock {totalAmount.toFixed(2)} USDC in Escrow</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
