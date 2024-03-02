require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})

require('ethernaut-challenges')
require('ethernaut-ai')
require('ethernaut-ui')
require('ethernaut-util')
require('ethernaut-util-ui')
require('ethernaut-interact')
require('ethernaut-interact-ui')
require('ethernaut-network')
require('ethernaut-network-ui')
require('ethernaut-wallet')
require('ethernaut-wallet-ui')

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'localhost',
  ethernaut: {
    ui: {
      exclude: {
        scopes: ['vars', 'hardhat'],
        tasks: [
          'compile',
          'check',
          'clean',
          'flatten',
          'node',
          'test',
          'navigate',
          'help',
          'run',
        ],
      },
    },
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
