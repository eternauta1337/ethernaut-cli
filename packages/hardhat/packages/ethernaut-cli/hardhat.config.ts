import dotenv from 'dotenv';
dotenv.config();

import '@ethernaut-cli-hardhat/ethernaut-interactive';
import '@ethernaut-cli-hardhat/ethernaut-toolkit';
import '@ethernaut-cli-hardhat/ethernaut-play';
import '@ethernaut-cli-hardhat/ethernaut-interact';

import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 11155111,
      forking: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      },
    },
  },
  interact: {
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
