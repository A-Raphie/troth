// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TrothEscrow} from "../src/TrothEscrow.sol";

contract DeployTrothEscrow is Script {
    function run() external returns (address) {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        address usdcAddress = vm.envOr("USDC_ADDRESS", address(0));

        // Default to a placeholder if not set in local simulation
        if (usdcAddress == address(0)) {
            // Standard Circle USDC on Arc Mainnet / Testnet placeholder
            usdcAddress = address(0x3600000000000000000000000000000000000000);
        }

        console.log("Deploying TrothEscrow with USDC:", usdcAddress);

        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            vm.startBroadcast();
        }

        TrothEscrow escrow = new TrothEscrow(usdcAddress);

        vm.stopBroadcast();

        console.log("TrothEscrow deployed to:", address(escrow));
        return address(escrow);
    }
}
