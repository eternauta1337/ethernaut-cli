class Retro {
  constructor(agora) {
    this.agora = agora
  }

  async submitBallot(roundId, addressOrENSName) {
    return this.agora.createRequest(
      '/api/v1/retropgf/round/:roundID/ballot/:addressOrENSName/submit',
      {
        roundId,
        addressOrENSName,
      },
    )
  }

  async addProjectToBallot(projectId, roundId, addressOrENSName) {
    return this.agora.createRequest(
      '/api/v1/retropgf/round/:roundID/ballot/:addressOrENSName/addProject?projectID= ',
      {
        projectId,
        roundId,
        addressOrENSName,
      },
    )
  }

  async removeProjectFromBallot(projectId, roundId, addressOrENSName) {
    return this.agora.createRequest(
      '/api/v1/retropgf/round/:roundID/ballot/:addressOrENSName/removeProject?projectID= ',
      {
        projectId,
        roundId,
        addressOrENSName,
      },
    )
  }

  async getRoundApplicants(roundId) {
    return this.agora.createRequest(
      '/api/v1/retropgf/round/:roundID/projects',
      {
        roundId,
      },
    )
  }

  async getRoundInfo(roundId) {
    return this.agora.createRequest('/api/v1/retropgf/round/:roundID ', {
      roundId,
    })
  }

  async getProjects(limit = 10, offset = 0) {
    const data = await this.agora.createRequest(
      `/projects?limit=${limit}&?offset=${offset}`,
    )

    return data.projects
  }
}

module.exports = Retro
