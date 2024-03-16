const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')

class EtherscanApi {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async getContractCode(address) {
    debug.log(`Fetching contract code for ${address}`, 'etherscan')

    const result = await this.createRequest({
      module: 'contract',
      action: 'getsourcecode',
      address,
    })

    if (!result) return undefined

    const data = result[0]

    if (data.ABI === 'Contract source code not verified') {
      throw new Error('Contract source code not verified')
    }

    data.ABI = JSON.parse(data.ABI)

    return data
  }

  serializeParams(params) {
    return Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&')
  }

  async createRequest(params = {}) {
    const url = this.baseUrl
    const serializedParams = this.serializeParams({
      ...params,
      apiKey: this.apiKey,
    })

    const config = {
      method: 'POST',
      url,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      data: serializedParams,
      responseType: 'json',
    }

    const response = await axios(config)

    // Http error
    if (response.status !== 200) {
      throw new Error(`Http status error: ${response.status}`)
    }

    // Api error
    if (response.data.status !== '1') {
      debug.log(response.data, 'interact')
      throw new Error(`Etherscan api error: ${response.data.result}`)
    }

    return response.data.result
  }
}

// TODO: Does etherscan support other networks?
// Where can I find a complete list of endpoints?
function getEtherscanUrl(chainId) {
  switch (chainId) {
    case 1: // Mainnet
      return 'https://api.etherscan.io/api'
    case 5: // Goerli
      return 'https://api-goerli.etherscan.io/api'
    case 10: // Optimism mainnet
      return 'https://api-optimistic.etherscan.io/api'
    case 420: // Optimism goerli
      return 'https://api-goerli-optimistic.etherscan.io/api'
    case 11155111: // Sepolia
      return 'https://api-sepolia.etherscan.io/api'
    default:
      return undefined
  }
}

module.exports = { EtherscanApi, getEtherscanUrl }
