const { validateSort } = require('./validate')

const DELEGATES_SORT_TYPE = ['most_delegators', 'weighted_random']
const DELEGATE_VOTES_SORT_TYPE = ['weight', 'block']

class Delegation {
  constructor(agora) {
    this.agora = agora
  }

  async delegates({ limit = 10, offset = 0, sort = DELEGATES_SORT_TYPE[0] }) {
    validateSort(sort, DELEGATES_SORT_TYPE)

    return (
      await this.agora.createRequest(
        `/delegates?limit=${limit}&?offset=${offset}&?sort=${sort}`,
      )
    ).delegates
  }

  async delegate({ addressOrEnsName }) {
    return this.agora.createRequest(`/delegates/${addressOrEnsName}`)
  }

  async delegateVotes({
    addressOrEnsName,
    limit = 10,
    offset = 0,
    sort = DELEGATE_VOTES_SORT_TYPE[0],
  }) {
    validateSort(sort, DELEGATE_VOTES_SORT_TYPE)

    return (
      await this.agora.createRequest(
        `/delegates/${addressOrEnsName}/votes?limit=${limit}&?offset=${offset}&?sort=${sort}`,
      )
    ).votes
  }

  async delegatees({ addressOrEnsName, limit = 10, offset = 0 }) {
    return this.agora.createRequest(
      `/delegatees/${addressOrEnsName}?limit=${limit}&?offset=${offset}`,
    )
  }

  async delegators({ addressOrEnsName, limit = 10, offset = 0 }) {
    return this.agora.createRequest(
      `/delegators/${addressOrEnsName}?limit=${limit}&?offset=${offset}`,
    )
  }
}

module.exports = Delegation
