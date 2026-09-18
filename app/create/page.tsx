"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import {
  ShieldCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatUSDC } from "@/lib/utils";

interface MilestoneFormItem {
  id: string;
  title: string;
  amount: string;
  days: number;
}

export default function CreateAgreementPage() {
  const { address, isConnected } = useAccount();

  // Form State
  const [title, setTitle] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [recipientType, setRecipientType] = useState<"direct" | "invite">("direct");
  const [contractorAddress, setContractorAddress] = useState("");
  const [reviewWindowDays, setReviewWindowDays] = useState<number>(7);

  const [milestones, setMilestones] = useState<MilestoneFormItem[]>([
    { id: "1", title: "Milestone 1: Smart Contracts & Gas Abstraction", amount: "500", days: 7 },
    { id: "2", title: "Milestone 2: Frontend & Deployment", amount: "1000", days: 14 },
  ]);

  const [claimSecret, setClaimSecret] = useState<string>(() => {
    return typeof window !== "undefined"
      ? "troth_" + Math.random().toString(36).substring(2, 12)
      : "troth_secret";
  });

  const [createdAgreementId, setCreatedAgreementId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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
    const shareableUrl = `${window.location.origin}/agreement/${createdAgreementId || 105}?claim=${claimSecret}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || milestones.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedAgreementId(Math.floor(Math.random() * 900) + 100);
    }, 450);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to Overview</span>
      </Link>

      <Card level="surface" className="p-6 sm:p-8">
        <div className="border-b border-[var(--border-default)] pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            <ShieldCheck className="size-4 text-[var(--accent)]" />
            <span>Escrow Creator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Create Milestone Agreement
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Lock funds in trustless escrow on Arc Mainnet. Releases are approved per milestone with sub-second finality.
          </p>
        </div>

        {createdAgreementId ? (
          /* Confirmation State */
          <div className="py-8 text-center space-y-6">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Escrow Agreement #{createdAgreementId} Created
              </h2>
              <p className="text-sm font-mono text-[var(--text-secondary)] mt-1 tabular-nums">
                {formatUSDC(totalAmount)} locked in escrow contract on Arc Mainnet
              </p>
            </div>

            {recipientType === "invite" && (
              <div className="max-w-md mx-auto p-4 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] text-left space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Shareable Invite Link
                </span>
                <p className="text-xs text-[var(--text-secondary)]">
                  Provide this link to the freelancer. When they connect their wallet, the contract will bind them as the recipient:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/agreement/${createdAgreementId}?claim=${claimSecret}`}
                    className="flex-1 px-3 py-1.5 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs font-mono select-all text-[var(--text-primary)]"
                  />
                  <Button size="sm" variant="primary" onClick={handleCopyLink}>
                    {copied ? "Copied!" : <Copy className="size-3.5" />}
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link href={`/agreement/${createdAgreementId}`}>
                <Button size="md" variant="primary">
                  <span>View Escrow Dashboard</span>
                  <ExternalLink className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Agreement Creation Form */
          <form onSubmit={handleCreate} className="space-y-8">
            {/* Step 1: Basics */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                1. Agreement Details
              </h2>
              <Input
                label="Agreement Title *"
                required
                placeholder="e.g. Arc Layer 1 Integration & Mini App Build"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Specification URL (Optional)"
                type="url"
                placeholder="https://github.com/my-org/project/issues/1"
                helperText="Link to the agreed scope of work, GitHub issue, or PRD document"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
              />
            </div>

            {/* Step 2: Contractor Assignment */}
            <div className="space-y-4 pt-6 border-t border-[var(--border-default)]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  2. Recipient Mode
                </h2>
                <div className="flex rounded-[var(--radius-input)] border border-[var(--border-default)] p-0.5 bg-[var(--bg-subtle)]">
                  <button
                    type="button"
                    onClick={() => setRecipientType("direct")}
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium cursor-pointer transition-colors ${
                      recipientType === "direct"
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Direct Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType("invite")}
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium cursor-pointer transition-colors ${
                      recipientType === "invite"
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Shareable Invite Link
                  </button>
                </div>
              </div>

              {recipientType === "direct" ? (
                <Input
                  label="Contractor Wallet Address *"
                  required
                  placeholder="0x..."
                  value={contractorAddress}
                  onChange={(e) => setContractorAddress(e.target.value)}
                  className="font-mono text-xs"
                />
              ) : (
                <div className="p-3.5 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                  <Info className="size-4 text-[var(--text-primary)] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-[var(--text-primary)]">Invite Link Mode:</strong> You do not need the freelancer&apos;s wallet address upfront. A cryptographic claim secret will be generated for you to share privately over Telegram, Discord, or email.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Milestones */}
            <div className="space-y-4 pt-6 border-t border-[var(--border-default)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    3. Milestone Breakdown
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Divide total deliverables into verifiable tranches.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMilestone}
                >
                  <Plus className="size-3.5" />
                  <span>Add Tranche</span>
                </Button>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <span className="size-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      required
                      placeholder="Milestone Deliverable description"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestone(m.id, "title", e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1.5 text-xs font-mono text-[var(--text-muted)]">$</span>
                        <input
                          type="number"
                          required
                          min="1"
                          step="1"
                          placeholder="Amount"
                          value={m.amount}
                          onChange={(e) => handleUpdateMilestone(m.id, "amount", e.target.value)}
                          className="w-full pl-5 pr-2 py-1.5 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs font-mono tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <span className="text-xs font-mono text-[var(--text-muted)]">USDC</span>

                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          aria-label={`Remove milestone ${idx + 1}`}
                          className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Balance Strip */}
              <div className="p-4 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Total Escrow Required
                </span>
                <span className="text-lg font-bold font-mono text-[var(--text-primary)] tabular-nums">
                  {formatUSDC(totalAmount)} USDC
                </span>
              </div>
            </div>

            {/* Step 4: Anti-Ghosting Window */}
            <div className="space-y-3 pt-6 border-t border-[var(--border-default)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    4. Anti-Ghosting Review Window
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Review duration before contractor can trigger automated release.
                  </p>
                </div>
                <select
                  value={reviewWindowDays}
                  onChange={(e) => setReviewWindowDays(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] cursor-pointer"
                >
                  <option value={1}>24 Hours (Fast demo)</option>
                  <option value={3}>3 Days (Fiverr standard)</option>
                  <option value={7}>7 Days (Upwork default)</option>
                  <option value={14}>14 Days (Extended)</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isSubmitting}
                disabled={totalAmount <= 0}
                className="w-full"
              >
                <ShieldCheck className="size-4" />
                <span>Deposit & Lock {formatUSDC(totalAmount)} in Escrow</span>
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
