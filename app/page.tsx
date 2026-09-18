"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Check,
  ExternalLink,
  Lock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatUSDC } from "@/lib/utils";

export default function HomePage() {
  // Realistic Micro-Escrow Simulator ($5 - $10 tranches)
  const [demoStep, setDemoStep] = useState<number>(2);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const handleSimulateApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setDemoStep(3);
    }, 350); // Arc ~350ms finality
  };

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col">
      {/* Network Ribbon */}
      <div className="w-full border-b border-[var(--border-default)] bg-[var(--bg-subtle)] py-1.5 px-4 text-xs font-mono text-[var(--text-secondary)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[var(--text-primary)]">Arc Mainnet (5042)</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <span>USDC Native Gas</span>
            <span>·</span>
            <span>0% Fee</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] text-balance">
          Trustless milestone escrow on Arc.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto text-pretty">
          Break work into verifiable tranches. Lock USDC upfront. Auto-release on client approval or inactivity.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
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
      </section>

      {/* Realistic Interactive Simulator */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <Card level="surface" className="p-5 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)]">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase text-[var(--text-muted)] block">
                Escrow #104 · Arc Micro-Grant PoC
              </span>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Mini App Smart Contract & UI
              </h2>
            </div>
            <div className="text-right">
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
            <div className="p-3 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-medium text-xs text-[var(--text-primary)]">
                    1. Smart Contract Core & Tests
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    $10.00 USDC · Released
                  </span>
                </div>
              </div>
              <Badge variant="success">Released</Badge>
            </div>

            {/* Milestone 2: $10.00 (Ready to Approve) */}
            <div
              className={`p-3 rounded-[var(--radius-input)] border flex items-center justify-between gap-3 transition-colors ${
                demoStep === 2
                  ? "border-[var(--accent)] bg-[var(--bg-surface)]"
                  : "border-[var(--border-default)] bg-[var(--bg-subtle)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    demoStep >= 3
                      ? "bg-emerald-500 text-white"
                      : "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  }`}
                >
                  {demoStep >= 3 ? <Check className="size-3 stroke-[3]" /> : "2"}
                </div>
                <div>
                  <h3 className="font-medium text-xs text-[var(--text-primary)]">
                    2. Frontend Interface & Arc Connect
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                    $10.00 USDC · PR #12 submitted
                  </span>
                </div>
              </div>

              {demoStep === 2 ? (
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isApproving}
                  onClick={handleSimulateApprove}
                >
                  <Zap className="size-3 text-emerald-400" />
                  <span>Approve & Release</span>
                </Button>
              ) : (
                <Badge variant="success">Released</Badge>
              )}
            </div>

            {/* Milestone 3: $5.00 (Pending) */}
            <div className="p-3 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex items-center justify-between gap-3 opacity-75">
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-muted)] flex items-center justify-center text-[10px] font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-xs text-[var(--text-primary)]">
                    3. Mainnet Deployment & Submission Docs
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    $5.00 USDC · In Progress
                  </span>
                </div>
              </div>
              <Badge variant="pending">Pending</Badge>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono border-t border-[var(--border-default)]">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3 text-[var(--text-secondary)]" />
              <span>7-day review window safeguards contractors against ghosting</span>
            </span>
            <span>Settles in ~350ms</span>
          </div>
        </Card>
      </section>

      {/* How It Works (Streamlined, Non-Redundant) */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-[var(--border-default)] w-full">
        <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] text-center mb-8">
          How Troth Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <div className="size-7 rounded-[var(--radius-input)] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold font-mono text-[var(--text-primary)]">
              1
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Lock Upfront</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Payer defines milestones ($5 – $50+) and locks USDC into the contract. A claim link is shared with the contractor.
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-7 rounded-[var(--radius-input)] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold font-mono text-[var(--text-primary)]">
              2
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Deliver & Prove</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Contractor connects wallet, claims agreement, and attaches a link to their deliverable (PR, demo, or commit).
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-7 rounded-[var(--radius-input)] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center text-xs font-bold font-mono text-[var(--text-primary)]">
              3
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Sub-Second Release</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Payer approves with 1 click to release USDC instantly. If payer is inactive for 7 days, funds auto-release.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
