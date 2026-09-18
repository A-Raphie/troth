# Troth — Architecture

## Overview

Troth is a decentralized milestone escrow system built natively for the **Arc Layer 1 network**. The system consists of an EVM-compatible Solidity smart contract (`TrothEscrow.sol`) deployed on Arc Mainnet, coupled with a client-rendered Next.js/Tailwind web application that talks directly to Arc RPC (`rpc.mainnet.arc.io`) via `wagmi` and `viem`. 

By anchoring transactions to Arc's native USDC gas economics and Malachite BFT sub-second consensus (~350ms finality), Troth provides the payment certainty of traditional Web2 platforms (Upwork/Fiverr) without platform custody, 20% rake fees, or clearance wait periods.

```
+-------------------------------------------------------------+
|                     Troth Client Web App                    |
|      (Next.js App Router, Tailwind CSS, wagmi, viem)        |
|  Dual-Theme UI: High-Trust Fintech  <-->  Cyber Terminal    |
+------------------------------+------------------------------+
                               | Web3 JSON-RPC
                               v
+-------------------------------------------------------------+
|                  Arc Mainnet (Chain ID 5042)                 |
|             USDC Native Gas · Malachite Sub-sec BFT         |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                  TrothEscrow.sol                    |   |
|   |  - createContract()                                 |   |
|   |  - claimContract() [for shareable link invites]     |   |
|   |  - submitMilestone() [attaches proof URI]           |   |
|   |  - approveMilestone() [instant USDC transfer]       |   |
|   |  - triggerAutoRelease() [ghosting expiration]       |   |
|   |  - requestRefund() / resolveMutualCancel()          |   |
|   +-----------------------------------------------------+   |
|                              |                              |
|                              v                              |
|   +-----------------------------------------------------+   |
|   |            USDC Token Contract (Arc Native)         |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

## Smart Contract Design (`TrothEscrow.sol`)

### Contract Lifecycle & State Machine

Each Agreement contains an array of `Milestone` structs.

```
           [Payer Creates & Funds Escrow]
                         |
                         v
       +-----------------------------------+
       |    Status: Initialized / Funded   |
       +-----------------------------------+
           |                           |
           | (Direct Address)          | (Open Claim Link)
           v                           v
   [Contractor Assigned]      [Contractor Calls claim()]
           \                          /
            v                        v
         +------------------------------+
         |     Status: Active / Ready   |
         +------------------------------+
                         |
                         | Contractor submits proof URI
                         v
         +------------------------------+
         |  Milestone Status: Submitted | <---+ Client requests revision
         +------------------------------+     | (resets clock)
           |                          |       |
           | Payer Approves           | Review timeout expires
           |                          | (e.g. 7 days ghosting)
           v                          v
     [Instant Release]       [Contractor Auto-Releases]
           \                          /
            v                        v
         +------------------------------+
         |  Milestone Status: Completed |
         +------------------------------+
```

### Data Model

```solidity
enum MilestoneStatus {
    Pending,
    Submitted,
    Completed,
    Refunded
}

struct Milestone {
    string title;
    uint256 amount;            // USDC amount (6 decimals)
    uint256 deadline;          // Unix timestamp
    uint256 submittedAt;       // Timestamp when contractor submitted
    string deliverableUrl;     // Proof URL or IPFS cid
    MilestoneStatus status;
}

enum AgreementStatus {
    Open,       // Awaiting claim (if open invite) or active
    Active,     // Contractor assigned and funded
    Completed,  // All milestones completed
    Cancelled   // Remaining funds refunded
}

struct Agreement {
    uint256 id;
    address payer;
    address contractor;        // address(0) if invite link
    bytes32 claimHash;         // keccak256(secret) for open invite claim
    string title;
    string metadataUri;        // Description or JSON metadata
    uint256 totalAmount;
    uint256 releasedAmount;
    uint256 reviewWindow;      // Timeout before auto-release (e.g., 7 days)
    AgreementStatus status;
    Milestone[] milestones;
}
```

### Key Functions

1. `createAgreement(address _contractor, bytes32 _claimHash, string memory _title, string memory _metadataUri, uint256 _reviewWindow, MilestoneInput[] memory _milestones)`: Transfers USDC from payer into escrow and initializes milestones.
2. `claimAgreement(uint256 _agreementId, string memory _claimSecret)`: Allows contractor holding the invite link secret to bind their wallet address.
3. `submitMilestone(uint256 _agreementId, uint256 _milestoneIndex, string memory _deliverableUrl)`: Contractor posts deliverable proof; starts the auto-release review window.
4. `approveMilestone(uint256 _agreementId, uint256 _milestoneIndex)`: Payer releases USDC for the milestone directly to the contractor address.
5. `triggerAutoRelease(uint256 _agreementId, uint256 _milestoneIndex)`: Contractor triggers release if `block.timestamp >= submittedAt + reviewWindow` and payer has taken no action.
6. `cancelUnclaimed(uint256 _agreementId)`: If agreement was created with a claim link and never claimed, payer can reclaim 100% of funds.
7. `contractorRefund(uint256 _agreementId)`: Contractor can unilaterally refund unreleased funds to payer.
8. `mutualCancel(uint256 _agreementId)`: Payer and contractor sign to refund remaining unreleased balance.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **L1 Network** | Arc Mainnet | Native USDC gas, predictable costs, sub-second finality (~350ms), Circle alignment. |
| **Smart Contract** | Solidity 0.8.24 + Foundry / Hardhat | EVM compatibility, secure reentrancy guards, standard testing harnesses. |
| **Frontend Framework** | Next.js 15 (App Router) + TypeScript | Fast serverless rendering, clean routing, easy static export. |
| **Web3 Client** | `wagmi` v2 + `viem` | Lightweight, performant, native support for custom EVM chains and Arc RPC. |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Rapid token-driven layout; enables clean dual-theme toggle. |
| **Hosting** | Netlify (Static Prebuilt) | Free, static-hostable rule compliant (no always-on backend daemons required). |

## Key Decisions & Trade-offs

1. **Client-Only Architecture (No Central DB / Server):**
   - *Decision:* State lives 100% on the Arc blockchain. Contract events and view functions serve all data.
   - *Why:* Meets the Raphie hard rule (must be free static-hostable without expiring DBs or Railway trial deaths mid-judging).
   - *Trade-off:* Relies on Arc RPC performance for querying agreement lists. Indexed via on-chain array or contract event filters.
2. **Dual Recipient Logic (Direct vs Claim Link):**
   - *Decision:* Support both direct address input and secret-hash claim links.
   - *Why:* Matches user preference and enables frictionless client onboarding where the freelancer doesn't even need to share a wallet address before the contract is created.
3. **Web2-Style Auto-Release Window:**
   - *Decision:* Implement an automatic release countdown after submission ($N$ days).
   - *Why:* Prevents the single largest failure mode in Web3 freelancing: client approving work off-band but disappearing without signing the transaction.

## Open Architectural Questions

- `[assumption: Arc RPC rate limits]` Public Arc RPC (`rpc.mainnet.arc.io`) handles standard JSON-RPC reads without aggressive rate limiting; fallback RPCs can be configured if provided by Circle.
- `[assumption: USDC contract address on Arc Mainnet]` Will verify official Arc Mainnet USDC ERC-20 contract address from Circle docs upon deployment.
