# Troth — Hackathon Demo Script (90 Seconds)

> **Format:** 90-Second Screencast Walkthrough  
> **Target Event:** Arc Microgrants (Circle / DoraHacks)  
> **Live App:** [https://trytroth.netlify.app](https://trytroth.netlify.app)  
> **Audio Pace:** ~135 words/minute · Total Narration: ~200 spoken words · Clear visual pauses

---

## Scene Breakdown & Judging Alignment

| Scene | Duration | Screen Action | Judging Criterion |
| :--- | :--- | :--- | :--- |
| **Scene 1: The Hook & Landing** | 0:00 – 0:18 (18s) | Homepage (`/`) hero, fee comparison table, 3-step workflow | Real-World Utility & Problem |
| **Scene 2: Creating the Escrow** | 0:18 – 0:42 (24s) | Create wizard (`/create`), milestone tranches, claim invite link | Product UX & Innovation |
| **Scene 3: Contractor Submission** | 0:42 – 1:02 (20s) | Milestone manager (`/agreement/104`), deliverable inspection | Technical Execution |
| **Scene 4: Instant Arc Settlement** | 1:02 – 1:20 (18s) | Approval click, sub-second BFT release, 7-day safety timer | Arc Ecosystem & Native Gas |
| **Scene 5: Proof & Outro** | 1:20 – 1:30 (10s) | Contract tests (11/11 passing), Netlify live link, GitHub repo | Verification & Open Source |

---

## Scene 1: The Hook & Landing Page (0:00 – 0:18)

**Visual:**  
Browser opens on [trytroth.netlify.app](https://trytroth.netlify.app). Smooth scroll past the hero headline *"Trustless milestone escrow on Arc L1"* down to the comparative breakdown: **Legacy Web2 (10–20% rake, 14-day hold) vs Troth (0% fee, ~350ms finality)**.

**Say:**  
> Freelance platforms take twenty percent of every invoice and freeze your payouts for two weeks.  
> Web3 direct transfers force someone to take all the counterparty risk.  
> This is Troth: non-custodial milestone escrow built on Arc Layer 1, settling in sub-second time with native USDC gas and zero platform rake.

---

## Scene 2: Creating a Multi-Milestone Escrow (0:18 – 0:42)

**Visual:**  
Click **"New Escrow"** in the top navigation. Land on `/create`. Fill out agreement:
- Title: *"Arc Micro-Grant Deliverable"*
- Milestone 1: *"Foundry Test Suite & Contracts"* — `$10.00 USDC`
- Milestone 2: *"Next.js 16 Web Application"* — `$15.00 USDC`
- Recipient mode toggled to **"Claimable Invite Link"**.
- Click **"Lock Escrow Deposit"**. Smooth loading animation confirms transaction.

**Say:**  
> Creating an escrow takes seconds.  
> I set two micro-milestones: ten dollars and fifteen dollars.  
> Because Arc uses USDC natively for gas, micro-payments are finally practical on-chain.  
> I choose a cryptographic invite link so my contractor can claim into their wallet directly, without prior coordination.

---

## Scene 3: Contractor Deliverable Submission (0:42 – 1:02)

**Visual:**  
Navigate to `/agreement/104`. Show the milestone card with live status badges. Click **"Submit Work"** on Milestone 1. Paste repository link and deliverable description. Status dynamically shifts to **"Under Review"**.

**Say:**  
> The agreement dashboard provides complete visibility for both sides.  
> The contractor submits proof of work with one click.  
> Troth initiates automated mutual safeguards: an auto-release countdown protects the worker against client ghosting, while delivery deadlines ensure clients can reclaim funds if work is abandoned.

---

## Scene 4: Instant BFT Settlement & Release (1:02 – 1:20)

**Visual:**  
Switch to payer perspective. The deliverable inspection card highlights the submitted proof. Click **"Approve & Release"**. Within ~350ms, status flashes **"Released"** and green settlement indicators illuminate with zero gas friction.

**Say:**  
> The client reviews the deliverable and clicks approve.  
> Thanks to Arc's sub-second BFT consensus, USDC releases straight to the contractor's wallet instantly.  
> No two-week escrow delays. No intermediaries. Just math and code.

---

## Scene 5: Verification & Links (1:20 – 1:30)

**Visual:**  
Display the clean terminal showing **"11 passed; 0 failed; 0 skipped"** from Foundry `forge test`, followed by the live Netlify application and the public GitHub repository page.

**Say:**  
> Troth is fully tested, open source on GitHub, and live right now at trytroth.netlify.app.  
> Trustless milestone escrow, built for the future of work on Arc.

---

## Recording Checklist for Production

- [ ] Resolution: 1920x1080 (16:9 60fps) centered on neutral desktop
- [ ] Wallet: Arc Mainnet or Testnet connected with clean address
- [ ] No extraneous browser tabs, bookmarks, or notifications visible
- [ ] Mouse clicks highlighted with smooth cursor acceleration
- [ ] Natural 2-second pause before and after transaction confirmation
