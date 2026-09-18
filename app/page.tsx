"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useTheme } from "@/context/ThemeContext";
import {
  Shield,
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
} from "lucide-react";

export default function HomePage() {
  const { theme } = useTheme();
  const { isConnected, address } = useAccount();
  const isTerminal = theme === "terminal";

  // Interactive Live Sandbox Widget state
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
    <div className={`w-full min-h-[calc(100vh-4rem)] ${isTerminal ? "terminal-grid" : "fintech-grid"}`}>
      {/* Network Telemetry Ticker */}
      <div
        className="w-full border-b py-2 px-4 text-xs font-mono transition-colors"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: isTerminal ? "rgba(16, 18, 26, 0.7)" : "var(--bg-secondary)",
          color: "var(--text-secondary)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">ARC MAINNET LIVE</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">CHAIN ID: 5042</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">GAS: ~0.0001 USDC (NATIVE)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5" /> FINALITY: ~350ms
            </span>
            <span>PLATFORM RAKE: 0%</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6 animate-fade-in"
          style={{
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>The Open Escrow Standard for Freelancers & Founders</span>
        </div>

        <h1
          className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          Milestone Escrow on Arc. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-emerald-400">
            Sub-second release. Zero rake.
          </span>
        </h1>

        <p
          className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Upwork and Fiverr-grade payment safety, built natively for Web3. Lock USDC upfront, verify deliverable proofs,
          and auto-release with sub-second finality.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/create"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all hover:scale-102 hover:shadow-lg cursor-pointer"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--accent-text)",
            }}
          >
            <span>Create New Escrow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#interactive-demo"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            style={{
              borderColor: "var(--border-strong)",
              color: "var(--text-primary)",
            }}
          >
            <span>Try Interactive Demo</span>
          </a>
        </div>
      </section>

      {/* Interactive Live Sandbox Preview Widget */}
      <section id="interactive-demo" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div
          className="rounded-2xl border p-6 sm:p-8 shadow-xl transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-strong)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400">
                Interactive Escrow Simulator
              </span>
              <h2 className="text-xl font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
                Contract #104: Full Stack Arc dApp
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span
                className="px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                Payer: 0x8a3f...49b1
              </span>
              <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                1,500.00 USDC
              </span>
            </div>
          </div>

          {/* Milestones Stepper */}
          <div className="py-6 space-y-4">
            {/* Milestone 1 */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                demoStep >= 1 ? "opacity-100" : "opacity-60"
              }`}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: demoStep === 1 ? "var(--accent-primary)" : "var(--border-subtle)",
              }}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-500 text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Milestone 1: Smart Contracts & Gas Abstraction
                  </h3>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    Released instantly · 500.00 USDC
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold w-fit">
                Completed
              </span>
            </div>

            {/* Milestone 2 */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                demoStep === 2
                  ? "ring-2 ring-cyan-500/40"
                  : demoStep > 2
                  ? "opacity-100"
                  : "opacity-60"
              }`}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: demoStep === 2 ? "var(--accent-primary)" : "var(--border-subtle)",
              }}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    demoStep > 2
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {demoStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Milestone 2: Frontend & Dual-Theme System
                  </h3>
                  <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                    Deliverable: github.com/pull/42 · 600.00 USDC
                  </span>
                </div>
              </div>

              {demoStep === 2 ? (
                <button
                  onClick={handleSimulateApprove}
                  disabled={isApproving}
                  className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-102"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "var(--accent-text)",
                  }}
                >
                  {isApproving ? (
                    <>
                      <Zap className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Confirming (350ms)...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Approve & Release (Simulate)</span>
                    </>
                  )}
                </button>
              ) : demoStep > 2 ? (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold w-fit">
                  Completed
                </span>
              ) : (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold w-fit">
                  Pending
                </span>
              )}
            </div>

            {/* Milestone 3 */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                demoStep === 3 ? "ring-2 ring-cyan-500/40" : "opacity-60"
              }`}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-neutral-500 text-white shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    Milestone 3: Mainnet Verification & Launch
                  </h3>
                  <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                    Target: Oct 10, 2026 · 400.00 USDC
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold w-fit">
                {demoStep === 3 ? "In Progress" : "Pending"}
              </span>
            </div>
          </div>

          {/* Anti-Ghosting Explanation Banner */}
          <div
            className="p-4 rounded-xl border flex items-start gap-3 text-xs"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                Built-in Web2 Anti-Ghosting Safeguard:
              </span>{" "}
              If a client fails to review submitted work within the 7-day review window, the contractor can trigger
              an on-chain auto-release to unlock the tranche.
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Why Arc Makes Troth Possible
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            Traditional freelance platforms take a 20% cut. Standard blockchains require volatile gas tokens and minutes of wait time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl border transition-all"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
              <Ban className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
              Web2 Platforms (Upwork / Fiverr)
            </h3>
            <ul className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li>❌ 10% – 20% platform rake on all earnings</li>
              <li>❌ 7 to 14 days clearance wait to withdraw</li>
              <li>❌ Arbitrary account freezes and chargebacks</li>
              <li>❌ Mandatory KYC and geographic bans</li>
            </ul>
          </div>

          <div
            className="p-6 rounded-2xl border transition-all"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
              Generic Ethereum / L2 Escrow
            </h3>
            <ul className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li>❌ Requires volatile native tokens (ETH) for gas</li>
              <li>❌ Slow finality blocks instant checkout feel</li>
              <li>❌ Multi-sigs lack sequential milestone logic</li>
              <li>❌ High gas spikes during congested blocks</li>
            </ul>
          </div>

          <div
            className="p-6 rounded-2xl border ring-2 ring-cyan-500/40 transition-all shadow-lg"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-primary)",
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>
              Troth on Arc Mainnet
            </h3>
            <ul className="space-y-2 text-xs" style={{ color: "var(--text-primary)" }}>
              <li>✅ 0% platform fee — direct peer-to-peer escrow</li>
              <li>✅ Sub-second deterministic settlement (~350ms)</li>
              <li>✅ Gas paid natively in USDC (~$0.0001)</li>
              <li>✅ Anti-ghosting auto-release timer built into code</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
