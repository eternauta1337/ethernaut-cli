require('dotenv').config({
  path: require('path').resolve(__dirname, '../../../../ethernaut-cli-hh/.env'),
})
require('@nomicfoundation/hardhat-ethers')
require('../../../src/index')
require('../../../../ethernaut-util/src/index')

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
}
