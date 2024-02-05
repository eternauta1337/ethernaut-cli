require('dotenv').config();

require('@nomicfoundation/hardhat-toolbox');

require('ethernaut-ui');
require('ethernaut-toolbox');
require('ethernaut-interact');
require('ethernaut-ai');
require('ethernaut-oz-challenges');

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
    hardhat: {
      name: 'sepolia',
      chainId: 11155111,
      forking: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      },
    },
  },
};
