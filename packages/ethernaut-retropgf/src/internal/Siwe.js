const siwe = require('siwe')

const domain = 'com.ethernaut.cli'
const origin = 'https://github.com/theethernaut/ethernaut-cli'

function createSiweMessage(address, statement) {
  const siweMessage = new siwe.SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
  })

  return siweMessage.prepareMessage()
}

module.exports = {
  createSiweMessage,
}
