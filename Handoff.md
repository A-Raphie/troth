# Troth — Handoff

Read this first if you are picking up or continuing work on Troth.

## Current State

The core specification files have been scaffolded and aligned with the **Arc Microgrants** hackathon requirements. Architecture and smart contract mechanics model Web2 escrow leaders (Upwork & Fiverr) with on-chain multi-milestones, payer approval, auto-release timers for ghosting prevention, and dual recipient assignment (direct address + invite link).

## What's Done
- [x] Project naming finalized: **Troth** (Archaic English for binding pledge / truth).
- [x] Research completed on DoraHacks requirements, Arc Mainnet primitives, and Web2 escrow patterns.
- [x] Full spec scaffolded:
  - [PRD.md](./PRD.md)
  - [Architecture.md](./Architecture.md)
  - [design.md](./design.md)
  - [Tasks.md](./Tasks.md)
  - [Memory.md](./Memory.md)

## In Progress
- [ ] Phase 0: Initializing the project codebase and smart contract structure.

## Blocked / Waiting
- None. Ready to scaffold and build contract + frontend.

## How to Run It (Once Scaffolded)

```bash
# In /Users/raphie/Documents/Hackathons/troth

# Install frontend dependencies
npm install # or bun install

# Start local Next.js dev server
npm run dev

# Run smart contract tests (Foundry)
forge test
```

## Immediate Next Steps
1. **Initialize Project Directory:** Set up the Next.js 15 app router template in `/troth` with Tailwind CSS and Lucide icons.
2. **Scaffold Smart Contract:** Create `contracts/TrothEscrow.sol` and initial Foundry unit tests matching the data structures in [Architecture.md](./Architecture.md).
3. **Build Dual-Theme Layout:** Implement the ThemeContext and header toggle between **Option A (High-Trust Fintech)** and **Option B (Cyber-Terminal)**.

## Pointers
- Spec: [PRD.md](./PRD.md) · [Architecture.md](./Architecture.md) · [design.md](./design.md)
- Plan: [Tasks.md](./Tasks.md)
- History & Decisions: [Memory.md](./Memory.md)
