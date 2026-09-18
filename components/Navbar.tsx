"use client";

import React from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useTheme } from "@/context/ThemeContext";
import { ShieldCheck, Terminal, Landmark, Wallet, ExternalLink } from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const isTerminal = theme === "terminal";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: isTerminal ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--accent-text)",
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
                Troth
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                Arc Mainnet · 350ms
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Overview
            </Link>
            <Link
              href="/create"
              className="px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              New Escrow
            </Link>
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Dual-Theme Switcher Pill */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all hover:scale-102"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
            title="Toggle between Option A (Fintech) and Option B (Cyber Terminal)"
          >
            {isTerminal ? (
              <>
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Theme:</span>
                <span className="text-cyan-400 font-mono font-bold">Terminal</span>
              </>
            ) : (
              <>
                <Landmark className="w-3.5 h-3.5 text-neutral-800" />
                <span className="hidden sm:inline">Theme:</span>
                <span className="font-bold text-neutral-900">Fintech</span>
              </>
            )}
          </button>

          {/* Network Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Arc: 5042</span>
          </div>

          {/* Connect Button */}
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-colors hover:border-red-500/50"
                style={{
                  borderColor: "var(--border-strong)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const injectedConnector = connectors.find((c) => c.id === "injected");
                if (injectedConnector) {
                  connect({ connector: injectedConnector });
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all hover:opacity-95"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--accent-text)",
              }}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
