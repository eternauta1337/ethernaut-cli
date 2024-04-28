const { validateResponse } = require('./validate')

class Auth {
  constructor(agora) {
    this.agora = agora
  }

  async nonce() {
    return this.agora.createRequest('/auth/nonce')
  }

  async verify({ message, signature }) {
    const response = this.agora.createRequest('/auth/verify', 'POST', {
      message,
      signature,
    })

    validateResponse(response, 200, `Error verifying user: ${response}`)
  }
}

module.exports = Auth
