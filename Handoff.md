# Troth — Handoff

Read this first if you are picking up or continuing work on Troth.

## Current State

Phases 0, 1, 2, and 4 are complete; Phase 3 deployment simulation verified:
- Smart contract (`TrothEscrow.sol`) implemented and 100% verified with Foundry test suite (7/7 tests passing in `contracts/`).
- Foundry deployment script (`DeployTrothEscrow.s.sol`) simulated and verified against Arc Mainnet RPC (Chain ID 5042).
- Next.js 16 app built and pre-rendered with Turbopack static export (`output: "export"`).
- Frontend live and verified on Netlify CDN: [https://trytroth.netlify.app](https://trytroth.netlify.app).
- Harvested primitives from `beui.dev`, `beautifului.dev`, and `shadcn/ui` with official Harvest Manifest in `design.md`.
- DoraHacks Arc Microgrants submission package (`SUBMISSION.md`) and 90s demo walkthrough script (`demo-script.md`) completed.
- Public GitHub repository: [https://github.com/A-Raphie/troth](https://github.com/A-Raphie/troth).

## What's Done
- [x] Project naming finalized: **Troth** (Archaic English for binding pledge / truth).
- [x] Research completed on DoraHacks requirements, Arc Mainnet primitives, and Web2 escrow patterns.
- [x] Full spec scaffolded (PRD, Architecture, design.md, Tasks, Memory, Handoff, ORCHESTRATOR).
- [x] Smart Contract Core (`TrothEscrow.sol`) + Foundry test suite (100% pass rate).
- [x] Foundry deployment script simulation verified against Arc Mainnet RPC.
- [x] Frontend application with High-Trust Minimalist Fintech design, interactive simulator, create wizard, and milestone manager.
- [x] UI Harvest Manifest documented in `design.md` citing libraries and licenses.
- [x] Live static production deployment on Netlify at [https://trytroth.netlify.app](https://trytroth.netlify.app).
- [x] DoraHacks submission package (`SUBMISSION.md`) and video script (`demo-script.md`).

## In Progress
- [ ] On-chain broadcast of contract if user wishes to run with personal deployer private key.

## Blocked / Waiting
- None. Everything is built, tested, deployed live to Netlify, and submitted to GitHub.

## How to Run It

```bash
# In /Users/raphie/Documents/Hackathons/troth

# Run smart contract tests (Foundry)
cd contracts && forge test

# Simulate deployment to Arc Mainnet
forge script script/DeployTrothEscrow.s.sol:DeployTrothEscrow --rpc-url https://rpc.mainnet.arc.io

# Broadcast deployment to Arc Mainnet (requires PRIVATE_KEY)
forge script script/DeployTrothEscrow.s.sol:DeployTrothEscrow --rpc-url https://rpc.mainnet.arc.io --broadcast --private-key <KEY>

# Local frontend dev server
bun run dev

# Build and export static bundle
bun run build
```

## Pointers
- Spec: [PRD.md](./PRD.md) · [Architecture.md](./Architecture.md) · [design.md](./design.md)
- Plan: [Tasks.md](./Tasks.md)
- Submission: [SUBMISSION.md](./SUBMISSION.md) · [demo-script.md](./demo-script.md)
- History & Decisions: [Memory.md](./Memory.md)
