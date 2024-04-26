class RetroFunding {
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

  async round({ roundId }) {
    return await this.agora.createRequest(`/retrofunding/rounds/${roundId}`)
  }

  async ballots({ roundId, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/ballots?limit=${limit}&offset=${offset}`,
      )
    ).ballots
  }

  async roundProjects({ roundId, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/projects?limit=${limit}&offset=${offset}`,
      )
    ).projects
  }

  async roundImpactMetrics({ roundId }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/impactMetrics`,
      )
    ).impactMetrics
  }
}

module.exports = RetroFunding
