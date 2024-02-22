require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');
require('../../../src/index');
require('../../../../ethernaut-toolbox/src/index');

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
  },
  ethernaut: {
    ai: {
      interpreter: {
        additionalInstructions: [''],
      },
      explainer: {
        additionalInstructions: [''],
      },
    },
  },
};
