require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})

require('ethernaut-ui')
require('ethernaut-toolbox')
require('ethernaut-interact')
require('ethernaut-ai')
require('ethernaut-challenges')
require('ethernaut-network')

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
    mainnet: {
      name: 'Ethereum Mainnet',
      url: 'https://ethereum-rpc.publicnode.com',
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
