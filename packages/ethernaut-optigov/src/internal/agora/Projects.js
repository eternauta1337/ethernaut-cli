const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')
const EthernautCliError = require('ethernaut-common/src/error/error')

class Projects {
  constructor(agora) {
    this.agora = agora
  }

  async getLatestRound() {
    // TODO: Implement this
    return 5
  }

  async projects({ limit, offset } = { limit: 10, offset: 0 }) {
    try {
      const response = await axios.get(
        `${this.agora.API_BASE_URL}/projects?limit=${limit}&?offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${this.agora.AGORA_API_KEY}`,
          },
        },
      )

      debug.log(`Projects: ${response.data}`, 'ethernaut-optigov')
      return response.data.data
    } catch (error) {
      throw new EthernautCliError(
        'ethernaut-optigov',
        `Http status error: ${error.message}`,
      )
    }
  }

  async roundProjects({ roundId, limit = 10, offset = 0 }) {
    try {
      const response = await axios.get(
        `${this.agora.API_BASE_URL}/retrofunding/rounds/${roundId}/projects?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )

      debug.log(`Round Projects: ${response.data}`, 'ethernaut-optigov')
      return response.data.data
    } catch (error) {
      throw new EthernautCliError(
        'ethernaut-optigov',
        `Http status error: ${error.message}`,
      )
    }
  }
}

module.exports = Projects
