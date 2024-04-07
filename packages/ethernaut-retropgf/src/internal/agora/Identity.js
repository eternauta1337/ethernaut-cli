class Identity {
  constructor(agora) {
    this.agora = agora
  }

  async isCitizen(addressOrENSName) {
    return this.agora.createRequest('/api/v1/citizens/:addressOrENSName', {
      addressOrENSName,
    })
  }

  async getCitizens() {
    return this.agora.createRequest('/api/v1/citizens', {})
  }

  async getProjects() {
    return this.agora.createRequest('/api/v1/projects', {})
  }
}

module.exports = Identity
