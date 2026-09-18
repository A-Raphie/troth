// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TrothEscrow} from "../src/TrothEscrow.sol";

contract MockUSDC is IERC20 {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
        _totalSupply += amount;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");
        _balances[from] -= amount;
        _allowances[from][msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

contract TrothEscrowTest is Test {
    TrothEscrow public escrow;
    MockUSDC public usdc;

    address public payer = address(0x1111);
    address public contractor = address(0x2222);
    address public stranger = address(0x3333);

    string public claimSecret = "troth_secret_salt_12345";
    bytes32 public claimHash;

    uint256 public constant M1_AMOUNT = 300 * 1e6; // 300 USDC
    uint256 public constant M2_AMOUNT = 700 * 1e6; // 700 USDC
    uint256 public constant TOTAL_AMOUNT = 1000 * 1e6; // 1,000 USDC
    uint256 public constant REVIEW_WINDOW = 7 days;

    function setUp() public {
        usdc = new MockUSDC();
        escrow = new TrothEscrow(address(usdc));

        claimHash = keccak256(abi.encodePacked(claimSecret));

        // Fund payer with USDC
        usdc.mint(payer, 10000 * 1e6);
        vm.prank(payer);
        usdc.approve(address(escrow), type(uint256).max);
    }

    function _createDirectAgreement() internal returns (uint256) {
        TrothEscrow.MilestoneInput[] memory milestones = new TrothEscrow.MilestoneInput[](2);
        milestones[0] = TrothEscrow.MilestoneInput({
            title: "Phase 1: Architecture & Contracts",
            amount: M1_AMOUNT,
            deadline: block.timestamp + 14 days
        });
        milestones[1] = TrothEscrow.MilestoneInput({
            title: "Phase 2: Frontend & Deployment",
            amount: M2_AMOUNT,
            deadline: block.timestamp + 30 days
        });

        vm.prank(payer);
        return escrow.createAgreement(
            contractor,
            bytes32(0),
            "Full Stack dApp on Arc",
            "ipfs://scope-uri",
            REVIEW_WINDOW,
            milestones
        );
    }

    function test_CreateAgreementDirect() public {
        uint256 balanceBefore = usdc.balanceOf(payer);
        uint256 id = _createDirectAgreement();

        assertEq(id, 1);
        assertEq(usdc.balanceOf(address(escrow)), TOTAL_AMOUNT);
        assertEq(usdc.balanceOf(payer), balanceBefore - TOTAL_AMOUNT);

        (
            uint256 agId,
            address agPayer,
            address agContractor,
            ,
            string memory title,
            ,
            uint256 total,
            uint256 released,
            uint256 refunded,
            uint256 reviewWin,
            TrothEscrow.AgreementStatus status
        ) = escrow.agreements(id);

        assertEq(agId, 1);
        assertEq(agPayer, payer);
        assertEq(agContractor, contractor);
        assertEq(title, "Full Stack dApp on Arc");
        assertEq(total, TOTAL_AMOUNT);
        assertEq(released, 0);
        assertEq(refunded, 0);
        assertEq(reviewWin, REVIEW_WINDOW);
        assertEq(uint8(status), uint8(TrothEscrow.AgreementStatus.Active));

        TrothEscrow.Milestone[] memory ms = escrow.getMilestones(id);
        assertEq(ms.length, 2);
        assertEq(ms[0].amount, M1_AMOUNT);
        assertEq(ms[1].amount, M2_AMOUNT);
    }

    function test_CreateAndClaimViaInviteLink() public {
        TrothEscrow.MilestoneInput[] memory milestones = new TrothEscrow.MilestoneInput[](1);
        milestones[0] = TrothEscrow.MilestoneInput({
            title: "Design System",
            amount: 500 * 1e6,
            deadline: block.timestamp + 7 days
        });

        vm.prank(payer);
        uint256 id = escrow.createAgreement(
            address(0),
            claimHash,
            "Brand Identity",
            "ipfs://brand-scope",
            REVIEW_WINDOW,
            milestones
        );

        // Check Open state
        (, , address assignedContractor, , , , , , , , TrothEscrow.AgreementStatus status) = escrow.agreements(id);
        assertEq(assignedContractor, address(0));
        assertEq(uint8(status), uint8(TrothEscrow.AgreementStatus.Open));

        // Payer cannot claim
        vm.prank(payer);
        vm.expectRevert("Payer cannot claim as contractor");
        escrow.claimAgreement(id, claimSecret);

        // Invalid secret fails
        vm.prank(contractor);
        vm.expectRevert("Invalid claim secret");
        escrow.claimAgreement(id, "wrong_secret");

        // Valid claim succeeds
        vm.prank(contractor);
        escrow.claimAgreement(id, claimSecret);

        (, , assignedContractor, , , , , , , , status) = escrow.agreements(id);
        assertEq(assignedContractor, contractor);
        assertEq(uint8(status), uint8(TrothEscrow.AgreementStatus.Active));
    }

    function test_SubmitAndPayerApprove() public {
        uint256 id = _createDirectAgreement();

        // Stranger cannot submit
        vm.prank(stranger);
        vm.expectRevert("Only contractor can submit");
        escrow.submitMilestone(id, 0, "https://github.com/pull/1");

        // Contractor submits milestone 0
        vm.prank(contractor);
        escrow.submitMilestone(id, 0, "https://github.com/pull/1");

        TrothEscrow.Milestone[] memory ms = escrow.getMilestones(id);
        assertEq(uint8(ms[0].status), uint8(TrothEscrow.MilestoneStatus.Submitted));
        assertEq(ms[0].deliverableUrl, "https://github.com/pull/1");
        assertGt(ms[0].submittedAt, 0);

        // Contractor cannot approve own work
        vm.prank(contractor);
        vm.expectRevert("Only payer can approve");
        escrow.approveMilestone(id, 0);

        // Payer approves
        uint256 contractorBalBefore = usdc.balanceOf(contractor);
        vm.prank(payer);
        escrow.approveMilestone(id, 0);

        assertEq(usdc.balanceOf(contractor), contractorBalBefore + M1_AMOUNT);

        ms = escrow.getMilestones(id);
        assertEq(uint8(ms[0].status), uint8(TrothEscrow.MilestoneStatus.Completed));

        // Submit and approve milestone 1 -> Agreement completed
        vm.prank(contractor);
        escrow.submitMilestone(id, 1, "https://github.com/pull/2");
        vm.prank(payer);
        escrow.approveMilestone(id, 1);

        (, , , , , , , , , , TrothEscrow.AgreementStatus status) = escrow.agreements(id);
        assertEq(uint8(status), uint8(TrothEscrow.AgreementStatus.Completed));
    }

    function test_AutoReleaseWhenPayerGhosts() public {
        uint256 id = _createDirectAgreement();

        // Contractor submits milestone 0
        vm.prank(contractor);
        escrow.submitMilestone(id, 0, "https://preview.app/demo");

        // Trying auto-release immediately fails
        vm.prank(contractor);
        vm.expectRevert("Review window has not elapsed");
        escrow.triggerAutoRelease(id, 0);

        // Fast forward time past review window (7 days + 1 second)
        vm.warp(block.timestamp + REVIEW_WINDOW + 1);

        // Auto-release succeeds
        uint256 contractorBalBefore = usdc.balanceOf(contractor);
        escrow.triggerAutoRelease(id, 0);

        assertEq(usdc.balanceOf(contractor), contractorBalBefore + M1_AMOUNT);
        TrothEscrow.Milestone[] memory ms = escrow.getMilestones(id);
        assertEq(uint8(ms[0].status), uint8(TrothEscrow.MilestoneStatus.Completed));
    }

    function test_RevisionRequestResetsWindow() public {
        uint256 id = _createDirectAgreement();

        vm.prank(contractor);
        escrow.submitMilestone(id, 0, "https://preview.app/v1");

        // Payer requests revision
        vm.prank(payer);
        escrow.requestRevision(id, 0, "Fix mobile styling bugs");

        TrothEscrow.Milestone[] memory ms = escrow.getMilestones(id);
        assertEq(uint8(ms[0].status), uint8(TrothEscrow.MilestoneStatus.Pending));
        assertEq(ms[0].submittedAt, 0);

        // Warping time won't allow auto-release because status is Pending
        vm.warp(block.timestamp + 10 days);
        vm.prank(contractor);
        vm.expectRevert("Milestone not submitted");
        escrow.triggerAutoRelease(id, 0);

        // Contractor resubmits
        vm.prank(contractor);
        escrow.submitMilestone(id, 0, "https://preview.app/v2-fixed");

        ms = escrow.getMilestones(id);
        assertEq(uint8(ms[0].status), uint8(TrothEscrow.MilestoneStatus.Submitted));
        assertGt(ms[0].submittedAt, 0);
    }

    function test_CancelUnclaimedInviteLink() public {
        TrothEscrow.MilestoneInput[] memory milestones = new TrothEscrow.MilestoneInput[](1);
        milestones[0] = TrothEscrow.MilestoneInput({
            title: "Quick Gig",
            amount: 250 * 1e6,
            deadline: block.timestamp + 3 days
        });

        vm.prank(payer);
        uint256 id = escrow.createAgreement(
            address(0),
            claimHash,
            "Unclaimed Gig",
            "ipfs://quick-gig",
            REVIEW_WINDOW,
            milestones
        );

        uint256 payerBalBefore = usdc.balanceOf(payer);

        // Payer cancels unclaimed agreement
        vm.prank(payer);
        escrow.cancelUnclaimed(id);

        assertEq(usdc.balanceOf(payer), payerBalBefore + 250 * 1e6);
        (, , , , , , , , , , TrothEscrow.AgreementStatus status) = escrow.agreements(id);
        assertEq(uint8(status), uint8(TrothEscrow.AgreementStatus.Cancelled));
    }

    function test_ContractorRefundUnreleased() public {
        uint256 id = _createDirectAgreement();

        // Contractor completes milestone 0
        vm.prank(contractor);
        escrow.submitMilestone(id, 0, "https://github.com/pr/1");
        vm.prank(payer);
        escrow.approveMilestone(id, 0);

        // Contractor decides they cannot complete milestone 1 (700 USDC) and refunds payer
        uint256 payerBalBefore = usdc.balanceOf(payer);
        vm.prank(contractor);
        escrow.contractorRefund(id);

        assertEq(usdc.balanceOf(payer), payerBalBefore + M2_AMOUNT);
        (, , , , , , , , uint256 refunded, , TrothEscrow.AgreementStatus status) = escrow.agreements(id);
        assertEq(refunded, M2_AMOUNT);
        assertEq(uint8(status), uint8(TrothEscrow.AgreementStatus.Cancelled));
    }

    function test_PayerClaimDeadlineRefundSuccess() public {
        uint256 id = _createDirectAgreement();

        // Time elapses past milestone 0 deadline (14 days) without contractor submitting work
        vm.warp(block.timestamp + 15 days);

        uint256 payerBalBefore = usdc.balanceOf(payer);

        // Payer claims refund for expired milestone 0
        vm.prank(payer);
        escrow.claimDeadlineRefund(id, 0);

        assertEq(usdc.balanceOf(payer), payerBalBefore + M1_AMOUNT);

        TrothEscrow.Milestone[] memory ms = escrow.getMilestones(id);
        assertEq(uint8(ms[0].status), uint8(TrothEscrow.MilestoneStatus.Refunded));
    }

    function test_RevertIfClaimRefundBeforeDeadline() public {
        uint256 id = _createDirectAgreement();

        // Warp only 2 days (deadline is 7 days)
        vm.warp(block.timestamp + 2 days);

        vm.prank(payer);
        vm.expectRevert("Milestone deadline has not elapsed");
        escrow.claimDeadlineRefund(id, 0);
    }

    function test_RevertIfClaimRefundAfterSubmission() public {
        uint256 id = _createDirectAgreement();

        // Contractor submits work before deadline
        vm.prank(contractor);
        escrow.submitMilestone(id, 0, "https://github.com/pr/1");

        // Warp past deadline
        vm.warp(block.timestamp + 8 days);

        // Payer attempts to claim deadline refund on submitted milestone
        vm.prank(payer);
        vm.expectRevert("Milestone must be pending");
        escrow.claimDeadlineRefund(id, 0);
    }

    function test_RevertIfNonPayerClaimsDeadlineRefund() public {
        uint256 id = _createDirectAgreement();

        vm.warp(block.timestamp + 8 days);

        // Stranger or contractor attempts to claim refund
        vm.prank(stranger);
        vm.expectRevert("Only payer can claim deadline refund");
        escrow.claimDeadlineRefund(id, 0);
    }
}
