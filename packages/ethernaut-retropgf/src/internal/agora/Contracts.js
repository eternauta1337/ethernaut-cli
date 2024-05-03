class Projects {
  constructor(agora) {
    this.agora = agora
  }

  async governor() {
    return this.agora.createRequest('/contracts/governor')
  }

  async alligator() {
    return this.agora.createRequest('/contracts/alligator')
  }

  async votingToken() {
    return this.agora.createRequest('/contracts/votingToken')
  }
}

module.exports = Projects
