require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})

require('ethernaut-ui')
require('ethernaut-toolbox')
require('ethernaut-interact')
require('ethernaut-ai')
require('ethernaut-challenges')

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'local',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
    local: {
      name: 'sepolia',
      url: 'http://localhost:8545',
    },
    hardhat: {
      name: 'sepolia',
      chainId: 11155111,
      forking: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      },
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
