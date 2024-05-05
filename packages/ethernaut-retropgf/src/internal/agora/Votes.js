const { validateSort } = require('./utils/validate')

const VOTES_SORT_TYPE = ['most_delegators', 'weighted_random']

class Votes {
  constructor(agora) {
    this.agora = agora
  }

  async votes({ limit = 10, offset = 0, sort = VOTES_SORT_TYPE[0] }) {
    validateSort(sort, VOTES_SORT_TYPE)

    return (
      await this.agora.createRequest(
        `/votes?limit=${limit}&?offset=${offset}&?sort=${sort}`,
      )
    ).votes
  }

  async vote({ transactionId }) {
    return this.agora.createRequest(`/votes/${transactionId}`)
  }
}

module.exports = Votes
