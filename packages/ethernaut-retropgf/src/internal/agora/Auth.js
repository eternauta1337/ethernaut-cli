class Auth {
  constructor(agora) {
    this.agora = agora
  }

  async nonce() {
    return this.agora.createRequest('/auth/nonce')
  }

  async verify({ message, signature }) {
    return this.agora.createRequest('/auth/verify', 'POST', {
      message,
      signature,
    })
  }
}

module.exports = Auth
