"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck,
  UserCheck,
  Ban,
  Activity,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { formatUSDC } from "@/lib/utils";

export default function HomePage() {
  // Interactive Live Escrow Simulator state
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const handleSimulateApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setDemoStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 350); // Arc sub-second 350ms finality simulation
  };

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col">
      {/* Live Telemetry Ticker */}
      <div className="w-full border-b border-[var(--border-default)] bg-[var(--bg-subtle)] py-2 px-4 text-xs font-mono text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ARC MAINNET</span>
            </span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>CHAIN ID: 5042</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>GAS: ~$0.0001 USDC NATIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
              <Zap className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>FINALITY: ~350ms</span>
            </span>
            <span className="text-[var(--border-strong)]">/</span>
            <span>PLATFORM RAKE: 0%</span>
          </div>
        </div>
      </div>

      {/* Institutional Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] mb-6 shadow-xs select-none">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Institutional-Grade Milestone Escrow</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] text-balance leading-tight">
          Milestone Escrow on Arc. <br />
          <span className="text-[var(--text-muted)] font-medium">
            Sub-second release. Zero platform rake.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto text-pretty leading-relaxed">
          Upwork and Fiverr-grade payment protection, built natively for Web3 and autonomous agents. Lock USDC upfront, verify deliverable proofs, and release with ~350ms deterministic finality.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/create">
            <Button size="lg" variant="primary">
              <span>Create New Escrow</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <a href="#interactive-simulator">
            <Button size="lg" variant="outline">
              <span>View Interactive Demo</span>
            </Button>
          </a>
        </div>
      </section>

      {/* High-Density Metric Strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Platform Fee"
            value="0.00%"
            subtext="Peer-to-peer contract"
            indicator="positive"
          />
          <StatCard
            label="Settlement Speed"
            value="~350ms"
            subtext="Malachite BFT consensus"
            indicator="positive"
          />
          <StatCard
            label="Gas Asset"
            value="USDC"
            subtext="Native dollar precision"
          />
          <StatCard
            label="Anti-Ghosting"
            value="7 Days"
            subtext="On-chain auto-release"
            indicator="positive"
          />
        </div>
      </section>

      {/* Interactive Escrow Simulator */}
      <section id="interactive-simulator" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Card level="surface" className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--border-default)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Live Contract Simulator
                </span>
                <Badge variant="success" dot>
                  Arc Mainnet
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Agreement #104 · Full Stack dApp & Contracts
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase block">
                Escrow Deposit
              </span>
              <span className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
                1,500.00 USDC
              </span>
            </div>
          </div>

          {/* Stepper list */}
          <div className="py-6 space-y-3">
            {/* Milestone 1: Completed */}
            <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="size-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                    Milestone 1: Smart Contracts & Gas Abstraction
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Released instantly · 500.00 USDC
                  </span>
                </div>
              </div>
              <Badge variant="success">Released</Badge>
            </div>

            {/* Milestone 2: Active & Interactive */}
            <div
              className={`p-4 rounded-[var(--radius-card)] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 ${
                demoStep === 2
                  ? "border-[var(--accent)] bg-[var(--bg-surface)] shadow-xs"
                  : demoStep > 2
                  ? "border-[var(--border-default)] bg-[var(--bg-subtle)]"
                  : "border-[var(--border-default)] opacity-60"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    demoStep > 2
                      ? "bg-emerald-500 text-white"
                      : "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  }`}
                >
                  {demoStep > 2 ? <Check className="size-4 stroke-[3]" /> : "2"}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                    Milestone 2: Frontend & Dual-Theme System
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    Proof: github.com/pull/42 · 600.00 USDC
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
                  <Zap className="size-3.5 text-emerald-400" />
                  <span>Approve & Release (Simulate)</span>
                </Button>
              ) : demoStep > 2 ? (
                <Badge variant="success">Released</Badge>
              ) : (
                <Badge variant="pending">Pending</Badge>
              )}
            </div>

            {/* Milestone 3: Pending */}
            <div
              className={`p-4 rounded-[var(--radius-card)] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 ${
                demoStep === 3
                  ? "border-[var(--accent)] bg-[var(--bg-surface)]"
                  : "border-[var(--border-default)] opacity-60"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="size-7 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-muted)] flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                    Milestone 3: Mainnet Verification & Launch
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Due Oct 10, 2026 · 400.00 USDC
                  </span>
                </div>
              </div>
              <Badge variant="pending">
                {demoStep === 3 ? "In Progress" : "Pending"}
              </Badge>
            </div>
          </div>

          {/* Anti-ghosting explainer callout */}
          <div className="p-3.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-subtle)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
            <Clock className="size-4 text-[var(--text-primary)] shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong className="text-[var(--text-primary)]">Automated Anti-Ghosting:</strong> If a client goes silent for 7 days following a deliverable submission, the contractor can trigger an on-chain auto-release to unlock the tranche without human platform support.
            </p>
          </div>
        </Card>
      </section>

      {/* Comparison Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border-default)] w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
            The Structural Advantage of Arc
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] text-pretty">
            Why building milestone escrow on Arc outperforms both traditional Web2 and existing Layer 1/2 networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card level="surface" className="p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <X className="size-4 text-red-500" />
              <span>Web2 (Upwork / Fiverr)</span>
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>• 10% to 20% platform rake on gross earnings</li>
              <li>• 7 to 14 days mandatory holding periods</li>
              <li>• Centralized dispute bias & chargeback risk</li>
              <li>• Strict platform lock-in & KYC overhead</li>
            </ul>
          </Card>

          <Card level="surface" className="p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <X className="size-4 text-amber-500" />
              <span>Standard Ethereum / L2s</span>
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>• Requires volatile native gas token (ETH)</li>
              <li>• Unpredictable network gas spikes</li>
              <li>• Multi-sig wallets lack milestone logic</li>
              <li>• Multi-minute block confirmations</li>
            </ul>
          </Card>

          <Card level="surface" className="p-5 border-[var(--accent)] shadow-xs">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Check className="size-4 text-emerald-600" />
              <span>Troth on Arc Mainnet</span>
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>• 0% platform fee — direct peer-to-peer</li>
              <li>• Deterministic ~350ms BFT finality</li>
              <li>• Gas paid natively in USDC (~$0.0001)</li>
              <li>• Anti-ghosting auto-release in smart code</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
