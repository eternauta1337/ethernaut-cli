const figlet = require('figlet')
const chalkAnimation = require('chalk-animation')
const { version, bugs } = require('./package.json')
const storage = require('ethernaut-common/src/io/storage')
const { refreshEnv } = require('ethernaut-common/src/io/env')
const { queryTelemetryConsent } = require('ethernaut-common/src/util/telemetry')

refreshEnv()

require('@nomicfoundation/hardhat-ethers')

// Order matters!
require('ethernaut-util')
require('ethernaut-util-ui')
require('ethernaut-interact')
require('ethernaut-interact-ui')
require('ethernaut-network')
require('ethernaut-network-ui')
require('ethernaut-wallet')
require('ethernaut-wallet-ui')
require('ethernaut-challenges')
require('ethernaut-ui')
require('ethernaut-ai')
require('ethernaut-ai-ui')

const txt = figlet.textSync('ethernaut-cli', { font: 'Graffiti' })
chalkAnimation.rainbow(txt).render()
console.log(
  `v${version} - Warning!!! BETA version. Please report issues ${bugs.url}`,
)

storage.init()

queryTelemetryConsent()

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'localhost',
  ethernaut: {
    ui: {
      exclude: [
        'vars/*',
        'check',
        'compile',
        'clean',
        'flatten',
        'test',
        'navigate',
        'run',
        'node',
        'help',
        'console',
      ],
    },
  },
}
