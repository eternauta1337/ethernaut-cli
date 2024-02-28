require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})

require('ethernaut-ui')
require('ethernaut-toolbox')
require('ethernaut-interact')
require('ethernaut-ai')
require('ethernaut-challenges')
require('ethernaut-network')
require('ethernaut-signer')

module.exports = {
  solidity: '0.8.19',
  defaultNetwork: 'localhost',
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
