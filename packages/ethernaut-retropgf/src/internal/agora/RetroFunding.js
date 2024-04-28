const { validateResponse } = require('./validate')

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
    const response = await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/submit`,
      'POST',
      {
        ballotId,
        ballotContent,
        signature,
      },
    )

    validateResponse(response, 200, `Error submitting ballot: ${response}`)
  }

  async roundProjects({ roundId, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/retrofunding/rounds/${roundId}/projects?limit=${limit}&offset=${offset}`,
      )
    ).projects
  }

  async roundImpactMetrics({ roundId }) {
    return await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics`,
    )
  }

  async impactMetric({ roundId, impactMetricId }) {
    return await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}`,
    )
  }

  async impactMetricComments({ roundId, impactMetricId }) {
    return await this.agora.createRequest(
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
    const response = await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}/comments`,
      'PUT',
      {
        id: commentId,
        commenter,
        content,
      },
    )

    validateResponse(
      response,
      200,
      `Error commenting on impact metric: ${response}`,
    )
  }

  async deleteImpactMetricComment({ roundId, impactMetricId, commentId }) {
    const response = await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/impactMetrics/${impactMetricId}/comments/${commentId}`,
      'DELETE',
    )

    validateResponse(response, 200, `Error deleting comment: ${response}`)
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
    const response = await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/impactMetrics`,
      'POST',
      {
        impactMetricId,
        allocationAmount,
      },
    )

    validateResponse(response, 201, `Error creating impact metric: ${response}`)
  }

  async deleteImpactMetric({
    roundId,
    ballotCasterAddressOrEns,
    impactMetricId,
  }) {
    const response = await this.agora.createRequest(
      `/retrofunding/rounds/${roundId}/ballots/${ballotCasterAddressOrEns}/impactMetrics/${impactMetricId}`,
      'DELETE',
    )

    validateResponse(response, 200, `Error deleting impact metric: ${response}`)
  }
}

module.exports = RetroFunding
