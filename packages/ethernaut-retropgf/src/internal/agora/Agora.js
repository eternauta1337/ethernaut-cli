const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')
const EthernautCliError = require('ethernaut-common/src/error/error')
const Identity = require('./Identity')
const Governance = require('./Governance')
const Retro = require('./Retro')

const BASE_URL = 'https://api.agora.space/ethernaut/retropgf'

class Agora {
  constructor(apiKey) {
    this.apiKey = apiKey

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

  async createRequest(endpoint, params = {}) {
    let populatedEndpoint = endpoint
    for (const key in params) {
      populatedEndpoint = populatedEndpoint.replace(`:${key}`, params[key])
    }

    const config = {
      method: 'POST',
      url: `${BASE_URL}${populatedEndpoint}`,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
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

    // Api error
    if (response.data.status !== '1') {
      debug.log(response.data, 'interact')
      throw new EthernautCliError(
        'ethernaut-retropgf',
        `Agora api error: ${response.data.result}`,
      )
    }

    return response.data.result
  }
}

module.exports = Agora
