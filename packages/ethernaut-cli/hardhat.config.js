require('dotenv').config()
const figlet = require('figlet')
const chalkAnimation = require('chalk-animation')
const { version } = require('./package.json')

require('@nomicfoundation/hardhat-ethers')

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
require('ethernaut-challenges')

const txt = figlet.textSync('ethernaut-cli', { font: 'Graffiti' })
chalkAnimation.rainbow(txt).render()
console.log(`v${version}`)

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
          'test',
          'navigate',
          'help',
          'run',
          'console',
        ],
      },
    },
    ai: {
      interpreter: {
        additionalInstructions: [],
      },
      explainer: {
        additionalInstructions: [],
      },
    },
  },
}
