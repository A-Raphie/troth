export const TROTH_ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_TROTH_ADDRESS ||
  "0xF8c7CB7845c8DAcE9146d57a17DEe436b13Ecbab") as `0x${string}`;

export const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x3600000000000000000000000000000000000000") as `0x${string}`;

export const TROTH_ESCROW_ABI = [
  {
    type: "constructor",
    inputs: [{ name: "_usdc", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createAgreement",
    inputs: [
      { name: "_contractor", type: "address", internalType: "address" },
      { name: "_claimHash", type: "bytes32", internalType: "bytes32" },
      { name: "_title", type: "string", internalType: "string" },
      { name: "_metadataUri", type: "string", internalType: "string" },
      { name: "_reviewWindow", type: "uint256", internalType: "uint256" },
      {
        name: "_milestoneInputs",
        type: "tuple[]",
        internalType: "struct TrothEscrow.MilestoneInput[]",
        components: [
          { name: "title", type: "string", internalType: "string" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimAgreement",
    inputs: [
      { name: "_agreementId", type: "uint256", internalType: "uint256" },
      { name: "_secret", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitMilestone",
    inputs: [
      { name: "_agreementId", type: "uint256", internalType: "uint256" },
      { name: "_milestoneIndex", type: "uint256", internalType: "uint256" },
      { name: "_deliverableUrl", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approveMilestone",
    inputs: [
      { name: "_agreementId", type: "uint256", internalType: "uint256" },
      { name: "_milestoneIndex", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "triggerAutoRelease",
    inputs: [
      { name: "_agreementId", type: "uint256", internalType: "uint256" },
      { name: "_milestoneIndex", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requestRevision",
    inputs: [
      { name: "_agreementId", type: "uint256", internalType: "uint256" },
      { name: "_milestoneIndex", type: "uint256", internalType: "uint256" },
      { name: "_reason", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelUnclaimed",
    inputs: [{ name: "_agreementId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "contractorRefund",
    inputs: [{ name: "_agreementId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "agreementCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "agreements",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "payer", type: "address", internalType: "address" },
      { name: "contractor", type: "address", internalType: "address" },
      { name: "claimHash", type: "bytes32", internalType: "bytes32" },
      { name: "title", type: "string", internalType: "string" },
      { name: "metadataUri", type: "string", internalType: "string" },
      { name: "totalAmount", type: "uint256", internalType: "uint256" },
      { name: "releasedAmount", type: "uint256", internalType: "uint256" },
      { name: "refundedAmount", type: "uint256", internalType: "uint256" },
      { name: "reviewWindow", type: "uint256", internalType: "uint256" },
      { name: "status", type: "uint8", internalType: "enum TrothEscrow.AgreementStatus" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMilestones",
    inputs: [{ name: "_agreementId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct TrothEscrow.Milestone[]",
        components: [
          { name: "title", type: "string", internalType: "string" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
          { name: "submittedAt", type: "uint256", internalType: "uint256" },
          { name: "deliverableUrl", type: "string", internalType: "string" },
          { name: "status", type: "uint8", internalType: "enum TrothEscrow.MilestoneStatus" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMilestoneCount",
    inputs: [{ name: "_agreementId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "usdc",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;
