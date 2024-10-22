const axios = require('axios')
// const debug = require('ethernaut-common/src/ui/debug')
const EthernautCliError = require('ethernaut-common/src/error/error')
const API_BASE_URL = 'https://vote.optimism.io/api/v1'

class Projects {
  // constructor(agora) {
  //   this.agora = agora
  // }

  constructor() {
    this.apiKey = process.env.AGORA_API_KEY
  }

  async projects({ limit, offset } = { limit: 10, offset: 0 }) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects?limit=${limit}&?offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )

      // debug.log(`Nonce: ${response.data.nonce}`, 'ethernaut-optigov')
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
        `${API_BASE_URL}/retrofunding/rounds/${roundId}/projects?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )

      // debug.log(`Nonce: ${response.data.nonce}`, 'ethernaut-optigov')
      // console.log('roundProjects: ', response.data)
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
