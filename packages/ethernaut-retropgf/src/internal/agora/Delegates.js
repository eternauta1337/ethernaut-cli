const { validateSort } = require('./validate')

const DELEGATES_SORT_TYPE = ['most_delegators', 'weighted_random']
const DELEGATE_VOTES_SORT_TYPE = ['weight', 'block']

class Delegates {
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
    return (await this.agora.createRequest(`/delegates/${addressOrEnsName}`))
      .delegate
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
    ).delegate
  }

  async delegatees({ addressOrEnsName, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/delegatees/${addressOrEnsName}?limit=${limit}&?offset=${offset}`,
      )
    ).delegate
  }

  async delegators({ addressOrEnsName, limit = 10, offset = 0 }) {
    return (
      await this.agora.createRequest(
        `/delegators/${addressOrEnsName}?limit=${limit}&?offset=${offset}`,
      )
    ).delegate
  }
}

module.exports = Delegates
