# Troth — Handoff

Read this first if you are picking up or continuing work on Troth.

## Current State

All core phases (0, 1, 2, 3, 4) are complete and live in production:
- Smart contract (`TrothEscrow.sol`) implemented and 100% verified with Foundry test suite (11/11 tests passing in `contracts/`).
- Deployed on **Arc Mainnet (Chain ID 5042)** at [`0xF7A20db6E51171263856f282ed188f795206d649`](https://arc.etherscan.io/address/0xF7A20db6E51171263856f282ed188f795206d649).
- Next.js 16 app built and pre-rendered with Turbopack static export (`output: "export"`).
- Frontend live and verified on Netlify CDN: [https://trytroth.netlify.app](https://trytroth.netlify.app).
- Harvested primitives from `beui.dev`, `beautifului.dev`, and `shadcn/ui` with official Harvest Manifest in `design.md`.
- DoraHacks Arc Microgrants submission package (`SUBMISSION.md`) and 90s demo walkthrough script (`demo-script.md`) completed.
- Public GitHub repository: [https://github.com/A-Raphie/troth](https://github.com/A-Raphie/troth).

## What's Done
- [x] Project naming finalized: **Troth** (Archaic English for binding pledge / truth).
- [x] Research completed on DoraHacks requirements, Arc Mainnet primitives, and Web2 escrow patterns.
- [x] Full spec scaffolded (PRD, Architecture, design.md, Tasks, Memory, Handoff, ORCHESTRATOR).
- [x] Smart Contract Core (`TrothEscrow.sol`) + Foundry test suite (11/11 tests, 100% pass rate).
- [x] Broadcasted on-chain to Arc Mainnet at `0xF7A20db6E51171263856f282ed188f795206d649`.
- [x] Frontend application with High-Trust Minimalist Fintech design, interactive simulator, create wizard, and milestone manager.
- [x] Mutual Anti-Ghosting safeguards implemented (contractor review window + client deadline refund).
- [x] UI Harvest Manifest documented in `design.md` citing libraries and licenses.
- [x] Live static production deployment on Netlify at [https://trytroth.netlify.app](https://trytroth.netlify.app).
- [x] DoraHacks submission package (`SUBMISSION.md`) and video script (`demo-script.md`).

## In Progress
- None. Ready for hackathon submission and judge review.

## Blocked / Waiting
- None. Everything is built, tested, deployed live to Netlify and Arc Mainnet, and pushed to GitHub.

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
