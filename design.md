# Troth — Design System & UI Specification

The single source of truth for Troth's frontend. Deviations update this file, not just the code.

## Design Direction: High-Trust Minimalist Fintech

Per user decision, Troth commits to **Option A: High-Trust Minimalist Fintech** (Mercury / Stripe / Linear inspired):
* Calm, hyper-clean, authoritative, effortless.
* Pure stark white canvas with crisp hairline borders (`border-zinc-200/80`).
* Monochromatic palette: deep charcoal text, obsidian primary actions, sage emerald success badges, warm amber pending tags.
* Tabular figures (`tabular-nums font-mono`) for transparent accounting and milestone amounts.
* Zero distraction, zero fluff: focused on financial safety, verifiable deliverable hashes, and sub-second deterministic settlement.

---

## Shared UI Architecture

### Harvest Manifest
- **Component: Button**
  - Source: `https://beui.dev/r/button-base.json` & `https://beui.dev/components/motion/button.md`
  - License: MIT
  - Kit destination: `components/ui/Button.tsx` (spring press, hover lift, variants: primary/secondary/outline/ghost/destructive, loading spinner)
- **Component: Animated Badge**
  - Source: `https://beui.dev/r/animated-badge.json`
  - License: MIT
  - Kit destination: `components/ui/Badge.tsx` (status roll variants, loading pulse, compact typography)
- **Component: Center Morph Modal**
  - Source: `https://beui.dev/r/center-morph-modal.json` & `ui.shadcn.com`
  - License: MIT
  - Kit destination: `components/ui/Modal.tsx` (center unfold transition, focus trapping, Escape dismiss, portal backdrop)
- **Component: Approval Card**
  - Source: `https://beautifului.dev#approval-card`
  - License: MIT
  - Kit destination: `components/ui/ApprovalCard.tsx` (human-in-the-loop deliverable review, proof links, auto-release countdown, approve action)
- **Component: Input**
  - Source: `https://ui.shadcn.com`
  - License: MIT
  - Kit destination: `components/ui/Input.tsx` (accessible label/helper/error states, focus ring)
- **Component: Card & StatCard**
  - Source: `https://beui.dev/components/motion/tilt-card.md` & `https://reui.io/components`
  - License: MIT
  - Kit destination: `components/ui/Card.tsx` & `components/ui/StatCard.tsx` (elevation ladder, hairline borders)

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
