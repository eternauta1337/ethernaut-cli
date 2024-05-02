const siwe = require('siwe')

const domain = 'localhost'
const origin = 'https://localhost/login'

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
