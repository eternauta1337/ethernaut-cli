const figlet = require('figlet')
const chalkAnimation = require('chalk-animation')
const { version } = require('./package.json')
const storage = require('ethernaut-common/src/io/storage')
const { refreshEnv } = require('ethernaut-common/src/io/env')

refreshEnv()

require('@nomicfoundation/hardhat-ethers')

require('ethernaut-ui')
require('ethernaut-ai')
require('ethernaut-ai-ui')
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
console.log(`v${version} - Warning!!! ALPHA version. Use at your own risk.`)

storage.init({
  ai: {
    model: 'gpt-4-1106-preview',
    interpreter: {
      additionalInstructions: [''],
    },
  },
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
        'run',
        'help',
        'console',
      ],
    },
  },
})

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'localhost',
  ethernaut: storage.readConfig(),
}
