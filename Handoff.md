# Troth — Handoff

Read this first if you are picking up or continuing work on Troth.

## Current State

Phase 0, Phase 1, and Phase 2 are complete:
- Smart contract (`TrothEscrow.sol`) implemented and 100% verified with Foundry test suite (7/7 tests passing).
- Next.js 16 app built and verified with Turbopack production build (`bun run build` in 3.8s, 0 errors).
- Dual-theme interface (Option A: Minimalist Fintech vs Option B: Cyber Terminal) implemented with live toggle.
- Local dev server is running on `http://localhost:3000`.

## What's Done
- [x] Project naming finalized: **Troth** (Archaic English for binding pledge / truth).
- [x] Research completed on DoraHacks requirements, Arc Mainnet primitives, and Web2 escrow patterns.
- [x] Full spec scaffolded (PRD, Architecture, design.md, Tasks, Memory, Handoff, ORCHESTRATOR).
- [x] Smart Contract Core (`TrothEscrow.sol`) + Foundry test suite (100% pass rate).
- [x] Frontend application with dual themes, interactive simulator, create wizard, and milestone manager.
- [x] Turbopack production build verified cleanly.

## In Progress
- [ ] Phase 3: Arc Mainnet live deployment & transaction verification.

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
