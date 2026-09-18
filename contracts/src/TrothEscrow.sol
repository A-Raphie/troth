// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TrothEscrow
 * @author Troth Protocol
 * @notice Trustless milestone escrow on Arc L1 with native USDC settlement.
 * Models Web2 escrow safeguards (Upwork/Fiverr):
 * - Multi-milestone contracts funded upfront
 * - Payer review and instant sub-second release
 * - Contractor auto-release protection against client ghosting
 * - Dual recipient support: Direct address or secret-hash claim link
 * - Mutual and unstarted cancellation safeguards
 */
contract TrothEscrow is ReentrancyGuard {
    IERC20 public immutable usdc;

    enum MilestoneStatus {
        Pending,
        Submitted,
        Completed,
        Refunded
    }

    enum AgreementStatus {
        Open,       // Awaiting claim via invite link
        Active,     // Contractor assigned and active
        Completed,  // All milestones completed/released
        Cancelled   // Agreement cancelled, remaining refunded
    }

    struct Milestone {
        string title;
        uint256 amount;          // USDC amount (6 decimals)
        uint256 deadline;        // Target delivery timestamp
        uint256 submittedAt;     // Timestamp when contractor submitted deliverable
        string deliverableUrl;   // Proof of work link (PR, preview, doc)
        MilestoneStatus status;
    }

    struct Agreement {
        uint256 id;
        address payer;
        address contractor;      // address(0) if created with claim link
        bytes32 claimHash;       // keccak256(secret) if invite link
        string title;
        string metadataUri;      // Additional details or scope URL
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 refundedAmount;
        uint256 reviewWindow;    // Auto-release review window in seconds (default 7 days)
        AgreementStatus status;
    }

    uint256 public agreementCount;
    mapping(uint256 => Agreement) public agreements;
    mapping(uint256 => Milestone[]) private _milestones;

    // Events
    event AgreementCreated(
        uint256 indexed agreementId,
        address indexed payer,
        address indexed contractor,
        uint256 totalAmount,
        uint256 milestoneCount,
        bool isInviteLink
    );
    event AgreementClaimed(uint256 indexed agreementId, address indexed contractor);
    event MilestoneSubmitted(
        uint256 indexed agreementId,
        uint256 indexed milestoneIndex,
        string deliverableUrl,
        uint256 submittedAt,
        uint256 autoReleaseTime
    );
    event MilestoneApproved(
        uint256 indexed agreementId,
        uint256 indexed milestoneIndex,
        uint256 amount,
        address indexed contractor
    );
    event AutoReleaseTriggered(
        uint256 indexed agreementId,
        uint256 indexed milestoneIndex,
        uint256 amount,
        address indexed contractor
    );
    event RevisionRequested(uint256 indexed agreementId, uint256 indexed milestoneIndex, string reason);
    event MilestoneRefunded(uint256 indexed agreementId, uint256 indexed milestoneIndex, uint256 amount);
    event AgreementCancelled(uint256 indexed agreementId, uint256 refundAmount);

    struct MilestoneInput {
        string title;
        uint256 amount;
        uint256 deadline;
    }

    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    /**
     * @notice Create a new milestone escrow agreement and deposit USDC.
     * @param _contractor Direct contractor address, or address(0) if using an invite link.
     * @param _claimHash keccak256(secret) for invite links, or bytes32(0) if direct.
     * @param _title Agreement title.
     * @param _metadataUri Description or scope URI.
     * @param _reviewWindow Review window in seconds before auto-release triggers (min 24h).
     * @param _milestoneInputs Array of milestones with titles, amounts, and deadlines.
     */
    function createAgreement(
        address _contractor,
        bytes32 _claimHash,
        string calldata _title,
        string calldata _metadataUri,
        uint256 _reviewWindow,
        MilestoneInput[] calldata _milestoneInputs
    ) external nonReentrant returns (uint256) {
        require(_milestoneInputs.length > 0, "At least one milestone required");
        require(_reviewWindow >= 1 days, "Review window must be at least 24 hours");

        bool isInvite = (_contractor == address(0));
        if (isInvite) {
            require(_claimHash != bytes32(0), "Claim hash required for invite links");
        } else {
            require(_contractor != msg.sender, "Contractor cannot be payer");
        }

        uint256 total = 0;
        for (uint256 i = 0; i < _milestoneInputs.length; i++) {
            require(_milestoneInputs[i].amount > 0, "Milestone amount must be > 0");
            require(_milestoneInputs[i].deadline > block.timestamp, "Deadline must be in future");
            total += _milestoneInputs[i].amount;
        }

        uint256 newId = ++agreementCount;
        Agreement storage ag = agreements[newId];
        ag.id = newId;
        ag.payer = msg.sender;
        ag.contractor = _contractor;
        ag.claimHash = _claimHash;
        ag.title = _title;
        ag.metadataUri = _metadataUri;
        ag.totalAmount = total;
        ag.reviewWindow = _reviewWindow;
        ag.status = isInvite ? AgreementStatus.Open : AgreementStatus.Active;

        for (uint256 i = 0; i < _milestoneInputs.length; i++) {
            _milestones[newId].push(Milestone({
                title: _milestoneInputs[i].title,
                amount: _milestoneInputs[i].amount,
                deadline: _milestoneInputs[i].deadline,
                submittedAt: 0,
                deliverableUrl: "",
                status: MilestoneStatus.Pending
            }));
        }

        emit AgreementCreated(newId, msg.sender, _contractor, total, _milestoneInputs.length, isInvite);

        // Pull total USDC into escrow
        require(usdc.transferFrom(msg.sender, address(this), total), "USDC transfer failed");

        return newId;
    }

    /**
     * @notice Claim an open agreement using the invite secret.
     */
    function claimAgreement(uint256 _agreementId, string calldata _secret) external nonReentrant {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Open, "Agreement not open for claim");
        require(ag.contractor == address(0), "Contractor already assigned");
        require(keccak256(abi.encodePacked(_secret)) == ag.claimHash, "Invalid claim secret");
        require(msg.sender != ag.payer, "Payer cannot claim as contractor");

        ag.contractor = msg.sender;
        ag.status = AgreementStatus.Active;

        emit AgreementClaimed(_agreementId, msg.sender);
    }

    /**
     * @notice Contractor submits deliverable for a milestone.
     */
    function submitMilestone(
        uint256 _agreementId,
        uint256 _milestoneIndex,
        string calldata _deliverableUrl
    ) external {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Active, "Agreement not active");
        require(msg.sender == ag.contractor, "Only contractor can submit");
        require(_milestoneIndex < _milestones[_agreementId].length, "Invalid milestone index");

        Milestone storage m = _milestones[_agreementId][_milestoneIndex];
        require(m.status == MilestoneStatus.Pending || m.status == MilestoneStatus.Submitted, "Milestone not pending");
        require(bytes(_deliverableUrl).length > 0, "Deliverable URL required");

        m.deliverableUrl = _deliverableUrl;
        m.submittedAt = block.timestamp;
        m.status = MilestoneStatus.Submitted;

        emit MilestoneSubmitted(
            _agreementId,
            _milestoneIndex,
            _deliverableUrl,
            block.timestamp,
            block.timestamp + ag.reviewWindow
        );
    }

    /**
     * @notice Payer approves deliverable and releases USDC instantly.
     */
    function approveMilestone(uint256 _agreementId, uint256 _milestoneIndex) external nonReentrant {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Active, "Agreement not active");
        require(msg.sender == ag.payer, "Only payer can approve");
        require(_milestoneIndex < _milestones[_agreementId].length, "Invalid milestone index");

        Milestone storage m = _milestones[_agreementId][_milestoneIndex];
        require(m.status == MilestoneStatus.Submitted, "Milestone must be submitted");

        m.status = MilestoneStatus.Completed;
        ag.releasedAmount += m.amount;

        _checkAllCompleted(_agreementId);

        emit MilestoneApproved(_agreementId, _milestoneIndex, m.amount, ag.contractor);

        require(usdc.transfer(ag.contractor, m.amount), "USDC release failed");
    }

    /**
     * @notice Auto-release triggered by contractor if payer has ghosted past the review window.
     */
    function triggerAutoRelease(uint256 _agreementId, uint256 _milestoneIndex) external nonReentrant {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Active, "Agreement not active");
        require(_milestoneIndex < _milestones[_agreementId].length, "Invalid milestone index");

        Milestone storage m = _milestones[_agreementId][_milestoneIndex];
        require(m.status == MilestoneStatus.Submitted, "Milestone not submitted");
        require(block.timestamp >= m.submittedAt + ag.reviewWindow, "Review window has not elapsed");

        m.status = MilestoneStatus.Completed;
        ag.releasedAmount += m.amount;

        _checkAllCompleted(_agreementId);

        emit AutoReleaseTriggered(_agreementId, _milestoneIndex, m.amount, ag.contractor);

        require(usdc.transfer(ag.contractor, m.amount), "Auto-release transfer failed");
    }

    /**
     * @notice Payer requests revisions, resetting the auto-release window.
     */
    function requestRevision(uint256 _agreementId, uint256 _milestoneIndex, string calldata _reason) external {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Active, "Agreement not active");
        require(msg.sender == ag.payer, "Only payer can request revision");
        require(_milestoneIndex < _milestones[_agreementId].length, "Invalid milestone index");

        Milestone storage m = _milestones[_agreementId][_milestoneIndex];
        require(m.status == MilestoneStatus.Submitted, "Milestone not submitted");

        m.status = MilestoneStatus.Pending;
        m.submittedAt = 0;

        emit RevisionRequested(_agreementId, _milestoneIndex, _reason);
    }

    /**
     * @notice Payer can unilaterally cancel an agreement that was created via invite link and never claimed.
     */
    function cancelUnclaimed(uint256 _agreementId) external nonReentrant {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Open, "Agreement not in Open state");
        require(msg.sender == ag.payer, "Only payer can cancel");
        require(ag.contractor == address(0), "Agreement already claimed");

        uint256 refund = ag.totalAmount;
        ag.status = AgreementStatus.Cancelled;
        ag.refundedAmount = refund;

        emit AgreementCancelled(_agreementId, refund);

        require(usdc.transfer(ag.payer, refund), "Refund transfer failed");
    }

    /**
     * @notice Contractor can unilaterally refund unreleased funds back to the payer.
     */
    function contractorRefund(uint256 _agreementId) external nonReentrant {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Active, "Agreement not active");
        require(msg.sender == ag.contractor, "Only contractor can refund");

        uint256 unreleased = ag.totalAmount - ag.releasedAmount - ag.refundedAmount;
        require(unreleased > 0, "No funds to refund");

        ag.status = AgreementStatus.Cancelled;
        ag.refundedAmount += unreleased;

        for (uint256 i = 0; i < _milestones[_agreementId].length; i++) {
            if (_milestones[_agreementId][i].status != MilestoneStatus.Completed) {
                _milestones[_agreementId][i].status = MilestoneStatus.Refunded;
            }
        }

        emit AgreementCancelled(_agreementId, unreleased);

        require(usdc.transfer(ag.payer, unreleased), "Contractor refund failed");
    }

    /**
     * @notice Payer reclaims unsubmitted milestone funds if contractor missed the deadline.
     *         Provides client-side anti-ghosting protection.
     */
    function claimDeadlineRefund(uint256 _agreementId, uint256 _milestoneIndex) external nonReentrant {
        Agreement storage ag = agreements[_agreementId];
        require(ag.status == AgreementStatus.Active, "Agreement not active");
        require(msg.sender == ag.payer, "Only payer can claim deadline refund");
        require(_milestoneIndex < _milestones[_agreementId].length, "Invalid milestone index");

        Milestone storage m = _milestones[_agreementId][_milestoneIndex];
        require(m.status == MilestoneStatus.Pending, "Milestone must be pending");
        require(block.timestamp > m.deadline, "Milestone deadline has not elapsed");

        m.status = MilestoneStatus.Refunded;
        ag.refundedAmount += m.amount;

        _checkAllCompleted(_agreementId);

        emit MilestoneRefunded(_agreementId, _milestoneIndex, m.amount);

        require(usdc.transfer(ag.payer, m.amount), "Deadline refund failed");
    }

    /**
     * @dev Check if all milestones are completed and mark agreement completed.
     */
    function _checkAllCompleted(uint256 _agreementId) internal {
        Agreement storage ag = agreements[_agreementId];
        bool allDone = true;
        for (uint256 i = 0; i < _milestones[_agreementId].length; i++) {
            if (_milestones[_agreementId][i].status != MilestoneStatus.Completed &&
                _milestones[_agreementId][i].status != MilestoneStatus.Refunded) {
                allDone = false;
                break;
            }
        }
        if (allDone) {
            ag.status = AgreementStatus.Completed;
        }
    }

    // View functions
    function getMilestones(uint256 _agreementId) external view returns (Milestone[] memory) {
        return _milestones[_agreementId];
    }

    function getMilestoneCount(uint256 _agreementId) external view returns (uint256) {
        return _milestones[_agreementId].length;
    }
}
