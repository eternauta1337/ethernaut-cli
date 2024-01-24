import { extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import "@nomicfoundation/hardhat-ethers";

import "./tasks/interact";
import "./tasks/add-contract";

import "./type-extensions";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const etherscanApiKey = userConfig.interact?.etherscanApiKey;

    config.interact.etherscanApiKey = etherscanApiKey;
  }
);
