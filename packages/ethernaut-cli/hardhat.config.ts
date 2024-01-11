import { HardhatUserConfig } from 'hardhat/config';

import '@ethernaut-cli/ethernaut-interactive';
import '@ethernaut-cli/ethernaut-toolset';
import '@ethernaut-cli/ethernaut-play';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
};

export default config;
