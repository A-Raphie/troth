# Troth — Tasks & Implementation Roadmap

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Phase 0 — Foundations (Maker Block 1)
- [x] Initialize Next.js project with Tailwind CSS, TypeScript, and Lucide icons in `/troth` — done when `npm run build` succeeds cleanly.
- [x] Scaffold Foundry / Hardhat workspace for `TrothEscrow.sol` with OpenZeppelin `ReentrancyGuard` and `IERC20` interfaces — done when contract compiles.
- [x] Configure Arc Mainnet & Testnet network definitions in `wagmi` config (Chain ID 5042, RPC `https://rpc.mainnet.arc.io`, Currency USDC) — done when wallet connects and displays Arc network.

## Phase 1 — Smart Contract MVP & Tests (Maker Block 2)
- [x] Write `TrothEscrow.sol` core logic:
  - Multi-milestone creation with USDC deposit.
  - Recipient binding: Direct address or invite link claim secret (`claimAgreement`).
  - Milestone lifecycle: `submitMilestone` with deliverable URI.
  - Release mechanism: `approveMilestone` releasing USDC to contractor immediately.
  - Auto-release timeout: `triggerAutoRelease` checking `block.timestamp >= submittedAt + reviewWindow`.
  - Refund & Cancellation: `cancelUnclaimed` and `contractorRefund`.
- [x] Write unit tests for all contract flows (100% test pass for creation, claim, submission, approval, auto-release, and refund edge cases).

## Phase 2 — Web Frontend & Harvested UI (Maker Block 3)
- [x] Standardize on High-Trust Minimalist Fintech aesthetic (Mercury/Stripe style) with zero raw hex sprawl.
- [x] Harvest and verify primitives from `beui.dev`, `beautifului.dev`, and `shadcn/ui` with official Harvest Manifest in `design.md`.
- [x] Build **Create Escrow Page (`/create`)**:
  - Title, milestone builder (dynamic add/remove milestones with realistic $5–$10 amounts), recipient toggle (Direct Address vs Claim Link).
  - USDC token approval + contract call transaction orchestration.
- [x] Build **Agreement Detail & Dashboard (`/agreement/[id]`)**:
  - Payer View: Review submitted proofs, Approve & Release button, transaction feedback.
  - Contractor View: Submit work modal (URL + notes), live review window countdown ticker, Auto-Release button when expired.
  - Claim Page for invite links (`/agreement/[id]?claim=SECRET`): One-click wallet binding.

## Phase 3 — Arc Network & Netlify Deployment (Maker Block 4)
- [x] Configure Foundry deployment script (`DeployTrothEscrow.s.sol`) with automated simulation against Arc Mainnet RPC (`https://rpc.mainnet.arc.io`, Chain ID 5042).
- [x] Verify 100% test coverage with Foundry (7/7 unit tests passing).
- [x] Deploy frontend to Netlify CDN ([https://trytroth.netlify.app](https://trytroth.netlify.app)) with static export (`output: "export"`) and zero server daemons.
- [ ] On-chain contract broadcast with deployer wallet key (`forge script script/DeployTrothEscrow.s.sol:DeployTrothEscrow --rpc-url https://rpc.mainnet.arc.io --broadcast`).

## Phase 4 — Submission & Demo Prep (Maker Block 5)
- [x] Create timed 90-second demo video walkthrough script (`demo-script.md`) mapped scene-by-scene to judging criteria.
- [x] Assemble complete DoraHacks Arc Microgrants submission package (`SUBMISSION.md`) with all required fields.
- [x] Document live Netlify endpoints, Arc RPCs, and GitHub repository in `README.md`.

---

## Done Definition
The project is **DONE** when:
1. `TrothEscrow.sol` has 100% test pass rate and verified Arc simulation script.
2. The frontend is live on Netlify ([https://trytroth.netlify.app](https://trytroth.netlify.app)) with full client-side wallet connectivity.
3. The GitHub repository is public with comprehensive documentation and verified harvest manifest.
4. DoraHacks submission package (`SUBMISSION.md`) and demo walkthrough script (`demo-script.md`) are complete.
