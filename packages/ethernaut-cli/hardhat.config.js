require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})
const figlet = require('figlet')
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

const fonts = figlet.fontsSync()
const font = fonts[Math.floor(Math.random() * fonts.length)]
console.log(figlet.textSync('EthernautCLI', { font }))
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
