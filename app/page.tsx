"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  Check,
  ExternalLink,
  RotateCcw,
  ChevronDown,
  Ban,
  Layers,
  FileCode,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  // Realistic Micro-Escrow Simulator ($5 - $10 tranches)
  const [demoStep, setDemoStep] = useState<number>(2);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSimulateApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setDemoStep(3);
    }, 350); // Arc ~350ms finality
  };

  const handleResetSimulator = () => {
    setDemoStep(2);
    setIsApproving(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col justify-between overflow-x-hidden">
      <div>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] text-[11px] sm:text-xs font-mono text-[var(--text-secondary)] mb-6 max-w-full">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Arc Layer 1 · Native USDC Gas · 0% Platform Rake</span>
            <span className="sm:hidden">Arc L1 · Native USDC Gas · 0% Fee</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight text-balance">
            Trustless milestone escrow on Arc.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto text-pretty leading-relaxed">
            Break work into verifiable tranches. Lock USDC upfront with sub-cent gas. Auto-release on deliverable approval or inactivity.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/create">
              <Button size="md" variant="primary">
                <span>Create Escrow</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="md" variant="outline">
                <span>How It Works</span>
              </Button>
            </a>
          </div>

          {/* Metric / Proof Strip */}
          <div className="mt-10 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--border-default)] border border-[var(--border-default)] rounded-[var(--radius-card)] overflow-hidden text-left shadow-xs">
            <div className="bg-[var(--bg-surface)] p-3.5 sm:p-4">
              <span className="block text-[11px] font-mono uppercase text-[var(--text-muted)]">Platform Rake</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">0%</span>
              <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5">vs 10%–20% on Upwork</span>
            </div>

            <div className="bg-[var(--bg-surface)] p-3.5 sm:p-4">
              <span className="block text-[11px] font-mono uppercase text-[var(--text-muted)]">BFT Finality</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">~350ms</span>
              <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5">Sub-second release</span>
            </div>

            <div className="bg-[var(--bg-surface)] p-3.5 sm:p-4">
              <span className="block text-[11px] font-mono uppercase text-[var(--text-muted)]">Native Gas</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">&lt; $0.001</span>
              <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5">Paid directly in USDC</span>
            </div>

            <div className="bg-[var(--bg-surface)] p-3.5 sm:p-4">
              <span className="block text-[11px] font-mono uppercase text-[var(--text-muted)]">Smart Contracts</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">7 / 7 Pass</span>
              <span className="block text-[10px] text-[var(--text-secondary)] mt-0.5">Foundry unit tested</span>
            </div>
          </div>
        </section>

        {/* Realistic Interactive Simulator */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 w-full">
          <Card level="surface" className="p-4 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-default)] gap-2">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase text-[var(--text-muted)] block">
                  Escrow #104 · Arc Micro-Grant PoC
                </span>
                <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  Mini App Smart Contract & UI
                </h2>
              </div>
              <div className="sm:text-right">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                  Total Locked
                </span>
                <span className="text-base font-bold font-mono text-[var(--text-primary)] tabular-nums">
                  $25.00 USDC
                </span>
              </div>
            </div>

            {/* Milestones list with realistic $5 - $10 amounts */}
            <div className="py-4 space-y-2.5">
              {/* Milestone 1: $10.00 (Completed) */}
              <div className="p-3 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-xs text-[var(--text-primary)] truncate">
                      1. Smart Contract Core & Tests
                    </h3>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] block">
                      $10.00 USDC · Released
                    </span>
                  </div>
                </div>
                <div className="shrink-0 self-start sm:self-auto">
                  <Badge variant="success">Released</Badge>
                </div>
              </div>

              {/* Milestone 2: $10.00 (Interactive) */}
              <div
                className={`p-3 rounded-[var(--radius-input)] border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                  demoStep === 2
                    ? "border-[var(--accent)] bg-[var(--bg-surface)] shadow-xs"
                    : "border-[var(--border-default)] bg-[var(--bg-subtle)]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      demoStep >= 3
                        ? "bg-emerald-500 text-white"
                        : "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    }`}
                  >
                    {demoStep >= 3 ? <Check className="size-3 stroke-[3]" /> : "2"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-xs text-[var(--text-primary)] truncate">
                      2. Frontend Interface & Arc Connect
                    </h3>
                    <span className="text-[11px] font-mono text-[var(--text-secondary)] block">
                      $10.00 USDC · PR #12 submitted
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  {demoStep === 2 ? (
                    <Button
                      size="sm"
                      variant="primary"
                      isLoading={isApproving}
                      onClick={handleSimulateApprove}
                      className="w-full sm:w-auto"
                    >
                      <Zap className="size-3 text-emerald-400 shrink-0" />
                      <span>Approve & Release</span>
                    </Button>
                  ) : (
                    <Badge variant="success">Released</Badge>
                  )}
                </div>
              </div>

              {/* Milestone 3: $5.00 (Pending) */}
              <div className="p-3 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 opacity-75">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-muted)] flex items-center justify-center text-[10px] font-bold shrink-0">
                    3
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-xs text-[var(--text-primary)] truncate">
                      3. Mainnet Deployment & Submission Docs
                    </h3>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] block">
                      $5.00 USDC · In Progress
                    </span>
                  </div>
                </div>
                <div className="shrink-0 self-start sm:self-auto">
                  <Badge variant="pending">Pending</Badge>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] font-mono border-t border-[var(--border-default)]">
              <span className="flex items-start sm:items-center gap-1.5 min-w-0 flex-1">
                <Clock className="size-3 text-[var(--text-secondary)] shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-pretty break-words leading-tight">7-day review window prevents client ghosting</span>
              </span>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <span>Settles in ~350ms</span>
                {demoStep >= 3 && (
                  <button
                    onClick={handleResetSimulator}
                    className="inline-flex items-center gap-1 text-[var(--text-primary)] hover:underline cursor-pointer font-sans text-xs transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset Simulation</span>
                  </button>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Why Arc Makes Troth Possible (3-Way Economic Comparison) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[var(--border-default)] w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Why Arc Makes Milestone Escrow Viable
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              Web2 marketplaces charge predatory fees. Standard blockchains suffer from volatile gas spikes and slow confirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Web2 */}
            <div className="p-5 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-3">
              <div className="size-8 rounded-[var(--radius-input)] bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Ban className="size-4" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Web2 Platforms (Upwork / Fiverr)
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>10% to 20% platform rake</strong> on all payments</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>5 to 14 day clearance hold</strong> on completed work</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Arbitrary account freezes & opaque corporate arbitration</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Generic EVM */}
            <div className="p-5 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-3">
              <div className="size-8 rounded-[var(--radius-input)] bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Layers className="size-4" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Generic EVM / Legacy L2s
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>Requires volatile native tokens (ETH) for gas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>$1 to $15 fee spikes make $10 micro-gigs unviable</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>Multi-minute block times block instant settlement</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Troth on Arc (Highlighted) */}
            <div className="p-5 rounded-[var(--radius-card)] border-2 border-[var(--accent)] bg-[var(--bg-surface)] space-y-3 shadow-sm relative">
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[var(--accent)] text-[var(--accent-foreground)]">
                  Arc L1 Native
                </span>
              </div>
              <div className="size-8 rounded-[var(--radius-input)] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="size-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Troth on Arc Layer 1
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>0% platform fee</strong> — peer-to-contract settlement</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>~350ms BFT finality</strong> for instant payouts</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Gas paid natively in USDC fractions (~$0.0001)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Built-in 7-day anti-ghosting auto-release protection</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works (Streamlined 3-Step Lifecycle) */}
        <section id="how-it-works" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[var(--border-default)] w-full">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] text-center mb-8">
            How Troth Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-2">
              <div className="size-7 rounded-[var(--radius-input)] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold font-mono text-[var(--text-primary)]">
                1
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">1. Lock Upfront</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Payer defines deliverable tranches ($5 – $50+) and locks USDC into the contract. An invite claim link is generated or direct address bound.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-2">
              <div className="size-7 rounded-[var(--radius-input)] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold font-mono text-[var(--text-primary)]">
                2
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">2. Deliver & Prove</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Contractor claims agreement and attaches deliverable proof (PR, live demo URL, or commit hash). The 7-day review clock begins.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-2">
              <div className="size-7 rounded-[var(--radius-input)] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold font-mono text-[var(--text-primary)]">
                3
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">3. Sub-Second Release</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Payer approves in 1 click releasing USDC in ~350ms. If the payer goes inactive for 7 days, funds auto-release to protect the worker.
              </p>
            </div>
          </div>
        </section>

        {/* Developer & Security Proof Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[var(--border-default)] w-full">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              Arc Microgrants Proof
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Architecture & Smart Contract Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="size-4 text-[var(--text-primary)]" />
                <h3 className="font-semibold text-xs text-[var(--text-primary)]">Checks-Effects-Interactions (CEI)</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                State updates precede external transfers with OpenZeppelin ReentrancyGuard v5. Zero reentrancy attack vectors.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="size-4 text-[var(--text-primary)]" />
                <h3 className="font-semibold text-xs text-[var(--text-primary)]">Cryptographic Claim Hashes</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Fund agreements via <code>bytes32 claimHash</code>. Recipients claim straight into their wallet without prior onboarding.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-[var(--text-primary)]" />
                <h3 className="font-semibold text-xs text-[var(--text-primary)]">Arc Mainnet Protocol Gas</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Chain ID 5042. Arc handles gas in native USDC units, eliminating the need to bridge volatile secondary gas tokens.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2 mb-2">
                <Check className="size-4 text-emerald-500" />
                <h3 className="font-semibold text-xs text-[var(--text-primary)]">100% Foundry Unit Tests</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                7/7 test suites passing covering creation, claims, submissions, approvals, auto-releases, and edge-case reverts.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
            <a
              href="https://github.com/A-Raphie/troth"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] inline-flex items-center gap-1 underline transition-colors"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="size-3" />
            </a>
            <span>·</span>
            <a
              href="https://github.com/A-Raphie/troth/blob/main/contracts/test/TrothEscrow.t.sol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] inline-flex items-center gap-1 underline transition-colors"
            >
              <span>Foundry Test Suite (7/7 Pass)</span>
              <ExternalLink className="size-3" />
            </a>
            <span>·</span>
            <a
              href="https://rpc.mainnet.arc.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] inline-flex items-center gap-1 underline transition-colors"
            >
              <span>Arc RPC (5042)</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </section>

        {/* Frequently Asked Questions (Objection Handling) */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 border-t border-[var(--border-default)] w-full">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {[
              {
                q: "What protects contractors from client ghosting?",
                a: "When a contractor submits proof of work, Troth starts an immutable 7-day review window. If the client fails to review or request revisions within 7 days, the contractor can trigger the auto-release function directly on-chain to unlock the milestone payment.",
              },
              {
                q: "Do I need ETH or SOL to pay for gas?",
                a: "No. On Arc Layer 1, gas is paid natively in USDC micro-fractions (~$0.0001 per call). You never need to bridge or hold a secondary volatile gas token.",
              },
              {
                q: "Can I fund an escrow for someone who does not have a wallet yet?",
                a: "Yes. When creating an agreement, select 'Claimable Invite Link'. The contract locks funds bound to a cryptographic hash. You share the link with the contractor, and when they connect their wallet, the agreement is claimed instantly.",
              },
              {
                q: "What happens if work cannot be completed or a dispute occurs?",
                a: "Troth includes mutual release mechanisms: contractors can voluntarily return unreleased milestone tranches directly to the payer, and payers can cancel unclaimed invite links for a 100% refund of locked funds.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-[var(--border-default)] rounded-[var(--radius-input)] bg-[var(--bg-surface)] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-default)] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Closing Call to Action */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[var(--border-default)] w-full text-center">
          <div className="p-8 sm:p-12 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Start your first escrow on Arc.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Zero platform rake. Sub-second BFT settlement. Native USDC gas. Setup takes under 60 seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/create">
                <Button size="md" variant="primary">
                  <span>Create Escrow</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <a
                href="https://github.com/A-Raphie/troth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="md" variant="outline">
                  <span>Explore GitHub</span>
                  <ExternalLink className="size-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Minimalist Institutional Footer */}
      <footer className="w-full border-t border-[var(--border-default)] py-6 px-4 text-xs text-[var(--text-muted)] bg-[var(--bg-surface)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">Troth</span>
            <span>·</span>
            <span>Arc Mainnet (5042)</span>
            <span>·</span>
            <span>Open Source (MIT)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)]">
            <a
              href="https://github.com/A-Raphie/troth"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="size-3" />
            </a>
            <span>·</span>
            <a
              href="https://dorahacks.io/hackathon/arc-microgrants"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
            >
              <span>Arc Microgrants</span>
              <ExternalLink className="size-3" />
            </a>
            <span>·</span>
            <a
              href="https://explorer.arc.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
            >
              <span>Arc Explorer</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
