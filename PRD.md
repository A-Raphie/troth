# Troth — PRD

## Problem

Trust in freelance contracts and peer-to-peer digital work is broken. In Web2 platforms like Upwork and Fiverr, gig workers and clients pay high rake fees (10% to 20%), endure 7- to 14-day clearance delays, and risk arbitrary account freezes or chargebacks. In Web3, sending upfront payments risks contractor abandonment, while working without upfront deposit risks client non-payment. Multi-signature wallets lack milestone logic and deadline mechanisms, while full escrow dApps on Ethereum or L2s suffer from volatile gas tokens and clunky approval UX.

**Troth** solves this with trustless, multi-milestone escrow on the **Arc Layer 1 blockchain**, where gas is paid natively in USDC and sub-second BFT finality (~350ms) makes payment release feel instantaneous.

## Personas

- **Primary: Freelancer / Contractor ("The Builder")** — Software engineers, designers, and agents completing milestone-based tasks. Wants guaranteed payment lockup before commencing work, zero platform rake, and protection against client ghosting.
- **Secondary: Client / Payer ("The Funder")** — Founders, DAOs, or project leads hiring remote contributors. Wants to lock funds safely so contractors are motivated, but only release tranches upon inspecting verifiable deliverables.
- **Tertiary: Hackathon Judge (Circle & Arc)** — Evaluates whether Arc's native USDC gas and sub-second settlement provide a tangible user experience edge over traditional chains and Web2 escrow platforms.

## Jobs to be Done

1. **Lock Upfront:** When hiring a contributor for a multi-stage project, the client wants to fund milestones into an immutable smart contract in one click, so the contractor knows the funds exist and cannot be pulled arbitrarily.
2. **Fulfill & Prove:** When a milestone is reached, the contractor wants to submit proof of work (GitHub PR, preview link, or hash) and trigger a review clock.
3. **Approve & Instant Release:** When work meets specifications, the client wants to release the tranche immediately, with sub-second confirmation on Arc.
4. **Auto-Release & Ghosting Protection:** If a client goes unresponsive after milestone delivery, the contractor wants funds to auto-release after a predetermined review window (e.g., 7 days), mirroring Web2 best practices without Web2 customer support bottlenecks.
5. **Mutual & Emergency Exit:** If both parties agree to part ways, or if work is never initiated, the escrow can be amicably cancelled and refunded to the client.

## Scope (v1 — Arc Microgrants)

- **Smart Contract Core (`TrothEscrow.sol`):**
  - Multi-milestone escrow (1 to $N$ milestones per agreement).
  - Dual recipient assignment: Direct wallet address or open claimable invite link via signed commitment.
  - State machine per milestone: `Pending` → `Funded` → `Submitted` → `Approved` (Released) / `Disputed` / `Refunded`.
  - Upwork/Fiverr-style auto-release window ($N$ days after submission if payer ghosts).
  - Mutual cancellation & unilateral cancellation if work has not been claimed/started.
- **Web App (Next.js + Tailwind + wagmi/viem):**
  - **Create Contract Flow:** Define title, description, milestones (amounts in USDC, deadlines), and recipient (address or claim link).
  - **Funder Dashboard:** View all created escrows, fund contracts, review submitted work, approve & release, or request adjustments.
  - **Contractor Dashboard / Claim Page:** Open invite link, connect wallet to claim, view deliverables, submit proof links.
  - **Dual-Theme Studio Interface:** Real-time toggle between **Option A (High-Trust Minimalist Fintech)** and **Option B (Cyber-Terminal Dark Web3)**.
  - Arc Mainnet RPC integration (`rpc.mainnet.arc.io`, Chain ID 5042) with native USDC fee display.

## Non-goals

- **No Centralized Arbitration Board:** V1 relies on mutual consent, time-locked auto-release, and unstarted refunds rather than a human dispute jury or centralized platform authority.
- **No Fiat On-Ramp / Off-Ramp In V1:** Pure USDC on Arc Mainnet.
- **No Private/Encrypted Deliverable Storage:** Deliverable URLs (GitHub, IPFS, Arweave, Loom) are posted as public strings on-chain.
- **No Token Issuance:** No governance token; zero-fee platform utility.

## Success Metrics

- **Leading:** End-to-end milestone lifecycle (create → fund → submit → approve → release) executed on Arc Mainnet in under 60 seconds with total gas cost under \$0.01 USDC.
- **Lagging:** Selection for Arc Microgrant (\$500 USDC) and zero failed or stuck escrow transactions during testing.

## Open Questions & Assumptions

- `[assumption: default review window]` Set default auto-release review window to 7 days (604,800 seconds), configurable by the payer down to 24 hours for hackathon demos.
- `[assumption: gas payment]` Arc uses 18-decimal native USDC for gas; contracts interact with standard ERC-20 USDC (6 decimals) or native wrapper according to Arc network standards.
