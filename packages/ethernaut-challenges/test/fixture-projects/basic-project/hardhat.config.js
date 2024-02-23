/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');
require('../../../src/index');

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.5.3',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
  },
  paths: {
    artifacts: '../../../artifacts',
  },
};
