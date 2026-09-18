"use client";

import React from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-default)] bg-[var(--bg-surface)]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="size-8 rounded-[var(--radius-input)] bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
              <Shield className="size-4.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base leading-none text-[var(--text-primary)]">
                Troth
              </span>
              <span className="text-[10px] tracking-wider text-[var(--text-muted)] uppercase mt-0.5">
                Milestone Escrow
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-[var(--radius-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/create"
              className="px-3 py-1.5 rounded-[var(--radius-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              New Escrow
            </Link>
          </nav>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Network badge (Single source of network info in the header) */}
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] text-xs font-mono text-[var(--text-secondary)]">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Arc Mainnet</span>
            <span className="sm:hidden text-[11px]">Arc</span>
          </div>

          {/* Wallet connection */}
          {isConnected && address ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="font-mono text-xs hover:border-red-400 hover:text-red-500 px-2.5 sm:px-3"
              title="Click to disconnect"
            >
              <span className="size-2 rounded-full bg-emerald-500 mr-1 sm:mr-1.5 shrink-0" />
              <span>{truncateAddress(address)}</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="px-2.5 sm:px-3"
              onClick={() => {
                const injectedConnector = connectors.find((c) => c.id === "injected");
                if (injectedConnector) {
                  connect({ connector: injectedConnector });
                }
              }}
            >
              <Wallet className="size-3.5 shrink-0" />
              <span className="hidden xs:inline">Connect Wallet</span>
              <span className="xs:hidden">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
