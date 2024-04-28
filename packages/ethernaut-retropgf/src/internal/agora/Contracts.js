class Contracts {
  constructor(agora) {
    this.agora = agora
  }

  async projects({ limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/projects?limit=${limit}&?offset=${offset}`,
      )
    ).projects
  }
}

module.exports = Contracts
