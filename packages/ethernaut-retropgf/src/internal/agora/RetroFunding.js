class RetroFunding {
  constructor(agora) {
    this.agora = agora
  }

  async round({ roundId }) {
    return this.agora.createRequest(`/retrofunding/rounds/${roundId}`)
  }

  async ballots({ roundId, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/ballots?limit=${limit}&offset=${offset}`,
      )
    ).ballots
  }

  async ballot({ roundId, ballotCasterAddressOrEns }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}`,
    )
  }

  async submitBallot({
    roundId,
    ballotCasterAddressOrEns,
    ballotId,
    ballotContent,
    signature,
  }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/submit`,
      'POST',
      {
        ballotId,
        ballotContent,
        signature,
      },
    )
  }

  async roundProjects({ roundId, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/projects?limit=${limit}&offset=${offset}`,
      )
    ).projects
  }

  async roundImpactMetrics({ roundId }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics`,
    )
  }

  async impactMetric({ roundId, impactMetricId }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}`,
    )
  }

  async impactMetricComments({ roundId, impactMetricId }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}/comments`,
    )
  }

  async commentImpactMetric({
    roundId,
    impactMetricId,
    commentId,
    commenter,
    content,
  }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}/comments`,
      'PUT',
      {
        id: commentId,
        commenter,
        content,
      },
    )
  }

  async deleteImpactMetricComment({ roundId, impactMetricId, commentId }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}/comments/${commentId}`,
      'DELETE',
    )
  }

  async ballotImpactMetrics({
    roundId,
    ballotCasterAddressOrEns,
    limit = 10,
    offset = 0,
  }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/impactMetrics?limit=${limit}&?offset=${offset}`,
      )
    ).impactMetrics
  }

  async createImpactMetric({
    roundId,
    ballotCasterAddressOrEns,
    impactMetricId,
    allocationAmount,
  }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/impactMetrics`,
      'POST',
      {
        impactMetricId,
        allocationAmount,
      },
      201,
    )
  }

  async deleteImpactMetric({
    roundId,
    ballotCasterAddressOrEns,
    impactMetricId,
  }) {
    return this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/impactMetrics/${impactMetricId}`,
      'DELETE',
    )
  }
}

module.exports = RetroFunding
