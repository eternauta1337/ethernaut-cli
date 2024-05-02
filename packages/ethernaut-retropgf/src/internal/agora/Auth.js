const { validateResponse } = require('./validate')

class Auth {
  constructor(agora) {
    this.agora = agora
  }

  async nonce() {
    return this.agora.createRequest('/auth/nonce')
  }

  async verify({ message, signature }) {
    await this.agora.createRequest('/auth/verify', 'POST', {
      message,
      signature,
    })

    // TODO: Fix validation
    // validateResponse(
    //   response,
    //   200,
    //   `Error verifying user: ${JSON.stringify(response, null, 2)}`,
    // )
  }
}

module.exports = Auth
