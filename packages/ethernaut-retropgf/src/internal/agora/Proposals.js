const { validateSort } = require('./validate')

const PROPOSALS_SORT_TYPE = ['status', 'term']
const PROPOSAL_VOTES_SORT_TYPE = ['weight', 'block']
const PROPOSAL_TYPES_SORT_TYPE = ['most_delegators', 'weighted_random']

class Proposals {
  constructor(agora) {
    this.agora = agora
  }

  async proposals({ limit = 10, offset = 0, sort = PROPOSALS_SORT_TYPE[0] }) {
    validateSort(sort, PROPOSALS_SORT_TYPE)

    return (
      await this.agora.createRequest(
        `/proposals?limit=${limit}&?offset=${offset}&?sort=${sort}`,
      )
    ).proposals
  }

  async proposal({ proposalId }) {
    return (await this.agora.createRequest(`/proposals/${proposalId}`)).proposal
  }

  async proposalVotes({
    proposalId,
    limit = 10,
    offset = 0,
    sort = PROPOSAL_VOTES_SORT_TYPE[0],
  }) {
    validateSort(sort, PROPOSAL_VOTES_SORT_TYPE)

    return (
      await this.agora.createRequest(
        `/proposals/${proposalId}/votes?limit=${limit}&?offset=${offset}&?sort=${sort}`,
      )
    ).votes
  }

  async proposalTypes({
    limit = 10,
    offset = 0,
    sort = PROPOSAL_TYPES_SORT_TYPE[0],
  }) {
    validateSort(sort, PROPOSAL_TYPES_SORT_TYPE)

    return (
      await this.agora.createRequest(
        `/proposals/types?limit=${limit}&?offset=${offset}&?sort=${sort}`,
      )
    ).types
  }
}

module.exports = Proposals
