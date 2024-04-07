class Governance {
  constructor(agora) {
    this.agora = agora
  }

  async getMetrics() {
    return this.agora.createRequest('/api/v1/admin/metrics', {})
  }

  async getVotingTokenContractMetadata() {
    return this.agora.createRequest('api/v1/contracts/votingToken', {})
  }

  async getAlligatorContractMetadata() {
    return this.agora.createRequest('api/v1/contracts/alligator', {})
  }

  async getGovernorContractMetadata() {
    return this.agora.createRequest('api/v1/contracts/governor', {})
  }

  async getContractMetadata() {
    return this.agora.createRequest('/api/v1/contracts', {})
  }

  async getVote(transactionId) {
    return this.agora.createRequest('/api/v1/votes/:transactionId', {
      transactionId,
    })
  }

  async getVotes() {
    return this.agora.createRequest('/api/v1/votes', {})
  }

  async getProposalTypes() {
    return this.agora.createRequest('/api/v1/proposals/types', {})
  }

  async getProposalVotes(proposalId) {
    return this.agora.createRequest('/api/v1/proposals/:proposalID/votes', {
      proposalId,
    })
  }

  async getProposal(proposalId) {
    return this.agora.createRequest('/api/v1/proposals/:proposalId', {
      proposalId,
    })
  }

  async getProposals() {
    return this.agora.createRequest('/api/v1/proposals', {})
  }

  async getDelegateVotes(addressOrENSName) {
    return this.agora.createRequest(
      '/api/v1/delegates/:addressOrENSName/votes',
      {
        addressOrENSName,
      },
    )
  }

  async getDelegatees(addressOrENSName) {
    return this.agora.createRequest('/api/v1/delegatees/:addressOrENSName', {
      addressOrENSName,
    })
  }

  async getDelegate(addressOrENSName) {
    return this.agora.createRequest('/api/v1/delegates/:addressOrENSName', {
      addressOrENSName,
    })
  }

  async getDelegates() {
    return this.agora.createRequest('/api/v1/delegates', {})
  }
}

module.exports = Governance
