import { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox-viem';
import '@ethernaut-cli/ethernaut-interactive';
import '@ethernaut-cli/ethernaut-toolset';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
};

export default config;
