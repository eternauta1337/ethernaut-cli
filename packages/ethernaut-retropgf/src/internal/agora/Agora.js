const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')
const EthernautCliError = require('ethernaut-common/src/error/error')
const Identity = require('./Identity')
const Governance = require('./Governance')
const Retro = require('./Retro')

const BASE_URL = 'https://vote.optimism.io/api/v1'

// See API spec at https://vote.optimism.io/api_v1
// API categories split into Identity, Governance, and Retro objects

class Agora {
  constructor() {
    this.bearerToken = process.env.AGORA_BEARER_TOKEN

    this._identity = new Identity(this)
    this._governance = new Governance(this)
    this._retro = new Retro(this)
  }

  get identity() {
    return this._identity
  }

  get governance() {
    return this._governance
  }

  get retro() {
    return this._retro
  }

  async getSpec() {
    return this.createRequest('/api/v1/spec', {})
  }

  async createRequest(endpoint, params = {}, method = 'GET') {
    let populatedEndpoint = endpoint
    for (const key in params) {
      populatedEndpoint = populatedEndpoint.replace(`:${key}`, params[key])
    }

    const config = {
      method,
      url: `${BASE_URL}${populatedEndpoint}`,
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
      responseType: 'json',
    }

    const response = await axios(config)

    // Http error
    if (response.status !== 200) {
      throw new EthernautCliError(
        'ethernaut-retropgf',
        `Http status error: ${response.status}`,
      )
    }

    debug.log(response.data, 'retropgf')

    return response.data
  }
}

module.exports = Agora
