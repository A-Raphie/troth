# Troth 🛡️

> **Trustless, multi-milestone escrow on the Arc Layer 1 blockchain.**  
> Sub-second settlement. Native USDC gas. Zero platform rake.

Built for the **Arc Microgrants (Circle / DoraHacks)** — [dorahacks.io/hackathon/arc-microgrants](https://dorahacks.io/hackathon/arc-microgrants).

---

## 💡 The Problem & The Arc Thesis

Freelancers and clients currently face a broken tradeoff:
1. **Web2 Freelance Platforms (Upwork, Fiverr):** Take predatory 10%–20% rake fees, impose 7- to 14-day clearance delays, and maintain centralized power to arbitrarily freeze funds or grant chargebacks.
2. **Traditional Web3 Escrows (Ethereum, Arbitrum, Base):** Force non-crypto users to manage volatile native gas tokens (ETH) to receive stablecoins, face high and erratic gas spikes, and lack the sub-second finality required for smooth checkout experiences.

### **Why Arc Changes Everything**
Troth is purpose-built for the **Arc Layer 1 network**:
* **USDC As Native Gas:** All transaction fees are paid natively in USDC (~$0.0001 per transaction). Users and autonomous agents never touch a volatile token.
* **Sub-Second Finality:** Powered by the Malachite BFT consensus engine, milestone releases settle deterministically in **~350 milliseconds**, making payments feel as fast as a Web2 credit card click with full cryptographic finality.
* **Anti-Ghosting Safeguards:** Models the battle-tested Upwork/Fiverr 7-day review window directly in Solidity: if a client fails to review submitted work, the contractor can trigger an on-chain auto-release.

---

## 🎨 High-Trust Minimalist Fintech Design

Troth features a calm, institutional design language inspired by modern fintech infrastructure (Stripe, Mercury, Linear):
* Monochromatic deep zinc palette with crisp contrast and hairline borders (`border-zinc-200/80`).
* Tabular figures (`font-mono font-medium`) for transparent milestone amounts.
* Interactive live escrow simulator on the landing page demonstrating upfront lock, milestone submission, and sub-second release.
* Zero distraction, zero fluff: pure focus on financial safety, verifiable deliverable hashes, and deterministic payment settlement.

---

## ⚡ Key Features

- **Multi-Milestone Escrow:** Break any agreement into 1 to $N$ discrete tranches with individual USDC payouts and deadlines.
- **Dual Recipient Modes:**
  - *Direct Assignment:* Assign specific contractor wallet address (`0x...`).
  - *Shareable Claim Link:* Generate a secret claim link (`bytes32 claimHash`) so the client can fund escrow before the contractor even connects a wallet.
- **Anti-Ghosting Protection:** Automatic release window (default 7 days) ensures freelancers get paid if clients become unresponsive after work submission.
- **Mutual & Unclaimed Cancellation:** Clients can cancel unclaimed invite escrows for a 100% refund; contractors can refund unreleased tranches if unable to finish.
- **Zero Platform Rake:** 100% peer-to-peer smart contract escrow.

---

## 🧪 Smart Contract Verification (`TrothEscrow.sol`)

All contract logic has been implemented with OpenZeppelin `IERC20` and `ReentrancyGuard` and verified with Foundry:

```bash
$ forge test
[PASS] test_CreateAgreementDirect() (gas: 632394)
[PASS] test_CreateAndClaimViaInviteLink() (gas: 595289)
[PASS] test_SubmitAndPayerApprove() (gas: 1125173)
[PASS] test_AutoReleaseWhenPayerGhosts() (gas: 831428)
[PASS] test_RevisionRequestResetsWindow() (gas: 866077)
[PASS] test_CancelUnclaimedInviteLink() (gas: 507758)
[PASS] test_ContractorRefundUnreleased() (gas: 874617)
Suite result: ok. 7 passed; 0 failed; 0 skipped
```

---

## 🛠️ Tech Stack & Architecture

- **Blockchain:** Arc Mainnet (Chain ID `5042`, RPC `https://rpc.mainnet.arc.io`, Currency `USDC`)
- **Smart Contracts:** Solidity `0.8.28`, Foundry, OpenZeppelin Contracts v5
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Web3 Connectivity:** `wagmi` v2, `viem`, `@tanstack/react-query`
- **Hosting:** Vercel (100% client-only, zero persistent server daemons, free static-hostable)

---

## 🚀 Quick Start

### 1. Smart Contracts
```bash
cd contracts
forge test
```

### 2. Frontend Development Server
```bash
bun install # or npm install
bun dev     # or npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view Troth.

---

## 📜 License
MIT License. Built with pride for the Arc & Circle ecosystem.
