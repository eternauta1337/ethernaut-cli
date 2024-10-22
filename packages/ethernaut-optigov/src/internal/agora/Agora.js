const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')
const EthernautCliError = require('ethernaut-common/src/error/error')
const Auth = require('./Auth')
const Projects = require('./Projects')

const API_BASE_URL = 'https://vote.optimism.io/api/v1'
const AGORA_API_KEY = process.env.AGORA_API_KEY

class Agora {
  constructor() {
    this.auth = new Auth(this)
    this.projects = new Projects(this)
  }

  async getSpec() {
    try {
      const response = await axios.get(`${API_BASE_URL}/spec`, {
        headers: {
          Authorization: `Bearer ${AGORA_API_KEY}`,
        },
      })

      debug.log(`Spec: ${response.data}`, 'ethernaut-optigov')
      return response.data
    } catch (error) {
      throw new EthernautCliError(
        'ethernaut-optigov',
        `Http status error: ${error.message}`,
      )
    }
  }
}

module.exports = Agora
