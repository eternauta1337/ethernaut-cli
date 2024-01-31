require('dotenv').config();

require('@nomicfoundation/hardhat-toolbox');

require('ethernaut-ui');
require('ethernaut-toolbox');
require('ethernaut-interact');

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'sepolia',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
  },
};
