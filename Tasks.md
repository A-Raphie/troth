# Troth — Tasks & Implementation Roadmap

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Phase 0 — Foundations (Maker Block 1)
- [ ] Initialize Next.js project with Tailwind CSS, TypeScript, and Lucide icons in `/troth` — done when `npm run build` succeeds cleanly.
- [ ] Scaffold Foundry / Hardhat workspace for `TrothEscrow.sol` with OpenZeppelin `ReentrancyGuard` and `IERC20` interfaces — done when contract compiles.
- [ ] Configure Arc Mainnet & Testnet network definitions in `wagmi` config (Chain ID 5042, RPC `https://rpc.mainnet.arc.io`, Currency USDC) — done when wallet connects and displays Arc network.

## Phase 1 — Smart Contract MVP & Tests (Maker Block 2)
- [ ] Write `TrothEscrow.sol` core logic:
  - Multi-milestone creation with USDC deposit.
  - Recipient binding: Direct address or invite link claim secret (`claimAgreement`).
  - Milestone lifecycle: `submitMilestone` with deliverable URI.
  - Release mechanism: `approveMilestone` releasing USDC to contractor immediately.
  - Auto-release timeout: `triggerAutoRelease` checking `block.timestamp >= submittedAt + reviewWindow`.
  - Refund & Cancellation: `cancelUnclaimed` and `contractorRefund`.
- [ ] Write unit tests for all contract flows (100% test pass for creation, claim, submission, approval, auto-release, and refund edge cases).

## Phase 2 — Web Frontend & Dual-Theme System (Maker Block 3)
- [ ] Implement `ThemeContext` and theme toggle in header:
  - **Option A (High-Trust Minimalist Fintech):** Crisp white/zinc, hairline borders, tabular figures.
  - **Option B (Cyber-Terminal Dark Web3):** Obsidian canvas, glowing cyan/emerald telemetry pills, monospace chips.
- [ ] Build **Create Escrow Page (`/create`)**:
  - Title, milestone builder (dynamic add/remove milestones with amounts & dates), recipient toggle (Direct Address vs Claim Link).
  - USDC token approval + contract call transaction orchestration.
- [ ] Build **Agreement Detail & Dashboard (`/agreement/[id]`)**:
  - Payer View: Review submitted proofs, Approve & Release button, transaction feedback.
  - Contractor View: Submit work modal (URL + notes), live review window countdown ticker, Auto-Release button when expired.
  - Claim Page for invite links (`/agreement/[id]?claim=SECRET`): One-click wallet binding.

## Phase 3 — Arc Mainnet Deployment & Live Verification (Maker Block 4)
- [ ] Deploy `TrothEscrow.sol` to Arc Mainnet using deployer wallet with USDC gas.
- [ ] Verify deployed contract address on Arc explorer and record the transaction hash.
- [ ] Test live end-to-end flow on Arc Mainnet (Create Agreement → Claim → Submit → Approve & Release) with real USDC transaction.
- [ ] Deploy frontend to Vercel (static/serverless) with zero build warnings.

## Phase 4 — Submission & Demo Prep (Maker Block 5)
- [ ] Create timed 2-minute demo video script covering:
  - Problem statement (Web2 fees vs Web3 lack of milestone escrow).
  - Creation with shareable link.
  - Contractor submission.
  - Sub-second Arc approval & release.
  - Theme switcher demonstration.
- [ ] Audit DoraHacks submission form fields and ensure all links (Live URL, Public GitHub repo, Contract address, Tx hash) are documented in `README.md`.

---

## Dependencies & Blockers
- Phase 1 (Smart contract) blocks Phase 2 (Frontend ABI integration).
- Arc Mainnet RPC access and funded deployer wallet with USDC on Arc required for Phase 3.

## Done Definition
The project is **DONE** when:
1. `TrothEscrow.sol` is deployed and verified on **Arc Mainnet**.
2. A live test transaction hash exists on Arc Mainnet showing escrow creation and milestone release.
3. The frontend is hosted live on **Vercel**, fully functional with wallet connection and theme toggle.
4. The GitHub repository is public with comprehensive documentation.

## Kill Criteria
If Arc Mainnet public RPC is unreachable or if native gas USDC cannot be bridged/acquired before Oct 12, 2026, deploy contract to Arc Testnet with Sepolia/mock USDC fallback while seeking organizer support on DoraHacks.
