# Troth — Design System & UI Specification

The single source of truth for Troth's frontend. Deviations update this file, not just the code.

## Dual-Theme Strategy

Per user specification, Troth ships with **two distinct visual themes** built into the application with an instant toggle (`ThemeSwitcher`) so the user and judges can compare and choose:

1. **Option A: High-Trust Minimalist Fintech** (Mercury / Stripe / Linear inspired)
2. **Option B: Cyber-Terminal Dark Web3** (Arc L1 / Bloomberg / DevTools inspired)

---

## Option A: High-Trust Minimalist Fintech

### Feel
**Institutional** — calm, hyper-clean, authoritative, effortless.

### Audience
Founders, Web3 native teams, institutional clients, and senior contractors who value clarity, legibility, and professional execution over flashy visual noise.

### Visual Tokens (Fintech)
- **Canvas:** Pure stark white (`#ffffff`) or light warm zinc (`#fbfbfa`) with crisp hairline borders (`#e5e5e0`).
- **Typography:** Clean sans-serif (`Geist` / `Inter`) with strict tabular figures (`tabular-nums`) for currency amounts and timestamps.
- **Color Palette:**
  - Primary text: Rich deep charcoal (`#111110`)
  - Secondary text: Muted graphite (`#666660`)
  - Accent / Primary CTA: Obsidian black (`#09090b`) with white text, or deep Circle Blue (`#004ef5`)
  - Success / Released: Subtle sage emerald (`#107548` on `#eef8f2`)
  - Pending / Escrowed: Warm amber (`#b45309` on `#fef3c7`)
- **Elevation:** Zero blurry drop-shadows; strictly razor hairline borders (`1px solid var(--border-color)`).

---

## Option B: Cyber-Terminal Dark Web3

### Feel
**Algorithmic** — high-density, technical, sub-second telemetry, glowing precision.

### Audience
Crypto-native engineers, DeFi builders, and hackathon judges wanting to see the raw power of Arc's sub-second consensus and native USDC gas in real time.

### Visual Tokens (Cyber-Terminal)
- **Canvas:** Pitch obsidian (`#08090c`) with dark elevated surfaces (`#0f1117`) and fine slate gridlines (`rgba(255, 255, 255, 0.08)`).
- **Typography:** Monospace headers and data feeds (`Geist Mono` / `JetBrains Mono`) with glowing status badges.
- **Color Palette:**
  - Primary text: Crisp cold white (`#f3f4f6`)
  - Secondary text: Slate chrome (`#94a3b8`)
  - Accent / Highlights: Arc Cyan (`#00f2fe`) & Electric Emerald (`#10b981`)
  - Status Pills: Pulsing neon dots with subtle ambient glow (`0 0 12px rgba(16, 185, 129, 0.4)`)
  - Telemetry Chip: Monospace block showing `FINALITY: 350ms | GAS: 0.0001 USDC | ARC-5042`.
- **Elevation:** Layered glassmorphism with dark backdrop filters (`backdrop-blur-md bg-white/[0.03]`).

---

## Shared UI Architecture

### Harvest Manifest (Component Kit)
All commodity UI primitives are imported or built upon standard, non-slop tokens:
- **Wallet Connection Modal:** Standard `ConnectButton` from RainbowKit / AppKit adapted to current theme tokens.
- **Milestone Stepper:** Horizontal & vertical responsive progress tracker with state badges (`Funded`, `Submitted`, `Under Review`, `Released`).
- **Deliverable Inspector Drawer / Modal:** Modal showcasing proof of work (link preview, commit sha, timestamp).
- **Auto-Release Countdown Clock:** Live animated countdown ticker displaying the remaining review window (e.g. `6d 23h 14m remaining until auto-release`).
- **Theme Switcher:** Compact header pill toggle: `[ Theme: Minimalist | Terminal ]`.

### Copy Tone
- **Tone:** Precise, direct, contract-grade. No fluff or marketing hyperbole.
- **Examples:**
  - *Good:* "300.00 USDC locked in escrow. Released upon milestone approval or automatically on Oct 2, 2026."
  - *Good:* "Milestone 1 submitted. Client review window active (144 hours remaining)."
  - *Bad:* "Supercharge your freelance journey with crypto magic!"

---

## Screen-by-Screen User Flow

1. **Front Door / Landing (`/`):**
   - Headline: *"Milestone escrow on Arc. Sub-second release. Zero platform rake."*
   - Live telemetry ribbon showing Arc Network status, current gas fee (\$0.0001 USDC), and instant settlement proof.
   - Primary Actions: `[ Create Escrow ]` and `[ Connect Wallet ]`.
   - Live interactive demo agreement widget showing how a milestone releases in <1 second.

2. **Create Escrow Wizard (`/create`):**
   - Step 1: Agreement Details (Title, Description / Scope URL).
   - Step 2: Milestone Breakdown (Title, USDC Amount, Estimated Deadline per milestone).
   - Step 3: Recipient Configuration:
     - Toggle: `Direct Wallet Address` vs `Generate Invite Link`.
   - Step 4: Review Window Setting (Default: 7 Days auto-release).
   - Step 5: Fund & Deploy (USDC `approve()` + `createAgreement()`).

3. **Funder Dashboard (`/agreement/[id]` - Payer View):**
   - Header with agreement summary, total locked USDC, and progress bar.
   - Milestone list with interactive action buttons:
     - If `Submitted`: `[ Review Deliverable ]`, `[ Approve & Release ]`, `[ Request Revision ]`.
     - If `Pending`: `Waiting for contractor submission`.
     - If `Completed`: Transaction hash link on Arc block explorer.
   - Mutual cancellation / refund action trigger.

4. **Contractor Claim & Work View (`/agreement/[id]?claim=secret` or `/agreement/[id]` - Contractor View):**
   - If accessed via invite link: `[ Claim This Escrow ]` connects wallet and locks contractor address.
   - For active milestones: `[ Submit Deliverable ]` (inputs: Deliverable URL + Notes).
   - Real-time display of the review countdown clock.
   - If review window lapses: `[ Claim Auto-Release ]` button enables.

---

## Avoid-List (Hard Nos)
- No bloated generic purple SaaS gradient blobs.
- No spinning confetti or cartoonish celebration popups.
- No hidden platform fees or confusing gas calculations; all values strictly in USDC.
- No dead ends: every empty state must provide a direct next step.
