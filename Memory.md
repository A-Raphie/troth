# Troth — Memory & Decision Log

Running log of decisions, conventions, and architectural trade-offs. Newest at the top.

## Decisions

- **2026-09-18** — **Single Fintech Design Direction:** Removed second terminal theme and theme toggle; standardized entire product on the High-Trust Minimalist Fintech aesthetic (Mercury/Stripe).
- **2026-09-18** — **Realistic Micropayment Amounts:** Scaled mock/simulator numbers from \$1,500 down to realistic \$5 – \$10 tranches (\$25 total), demonstrating Arc's sub-cent gas efficiency on micro-gigs.
- **2026-09-18** — **Landing Page Streamlining:** Removed repetitive metric callouts in favor of a concise 3-step "How It Works" workflow (Lock → Deliver → Release).
- **2026-09-18** — **Name Selection ("Troth"):** Selected from archaic English legal corpus (*"plight one's troth"* = sacred binding pledge). One syllable, zero naming collisions in crypto, directly conveys trustless commitment.
- **2026-09-18** — **Web2 Escrow Alignment (Upwork/Fiverr Model):** Chose multi-milestone support and automatic release windows ($N$ days review timeout) over naive multisig or DAO arbitration. Protects contractors against client ghosting.
- **2026-09-18** — **Dual Recipient Assignment:** Supported both direct wallet addresses and claimable invite links (`bytes32 claimHash`). Allows funders to create escrows before the contractor sets up their wallet.
- **2026-09-18** — **Dual-Theme Studio Architecture:** Supported both Option A (High-Trust Minimalist Fintech) and Option B (Cyber-Terminal Dark Web3) via a client-side theme switcher to let judges and users choose their preferred aesthetic.
- **2026-09-18** — **Client-Only Architecture (Static Rule):** No PostgreSQL/MongoDB backend or persistent daemons; all agreement state lives purely on Arc Mainnet smart contracts, guaranteeing 100% uptime on Netlify without trial expiration risks.

## Conventions

- **USDC Units:** Contract internally calculates amounts in USDC standard 6 decimals (`10^6`), formatted cleanly in UI with `Intl.NumberFormat` as `$X.XX USDC`.
- **Arc Gas Units:** Note that Arc native gas uses 18-decimal representation for protocol-level gas accounting, but user-facing fees are displayed in human-readable dollar cents.
- **Contract Function Signatures:** Standard camelCase for functions (`createAgreement`, `submitMilestone`, `approveMilestone`); all critical state changes emit indexed events.

## Gotchas

- **Arc Gas Precision:** When interacting with native gas on Arc, ensure wallets recognize Arc (Chain ID 5042) with USDC as native currency rather than ETH.
- **Ghosting Counter Logic:** Ensure `submittedAt` resets only if the payer explicitly submits a revision request; contractor resubmission updates the timestamp.

## Things to Not Forget

- Verify official USDC ERC-20 token address on Arc Mainnet before final deployment.
- Ensure demo video captures the <1 second finality moment on screen when milestone is approved.
