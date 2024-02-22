const axios = require('axios');
const debug = require('common/src/debug');

class EtherscanApi {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getContractCode(address) {
    const result = await this.createRequest({
      module: 'contract',
      action: 'getsourcecode',
      address,
    });

    if (!result) return undefined;

    const data = result[0];

    if (data.ABI === 'Contract source code not verified') {
      throw new Error('Contract source code not verified');
    }

    data.ABI = JSON.parse(data.ABI);

    return data;
  }

  serializeParams(params) {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&');
  }

  async createRequest(params = {}) {
    const url = `${this.baseUrl}/api`;
    const serializedParams = this.serializeParams({
      ...params,
      apiKey: this.apiKey,
    });

    const config = {
      method: 'POST',
      url,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      data: serializedParams,
      responseType: 'json',
    };

    const response = await axios(config);

    // Http error
    if (response.status !== 200) {
      throw new Error(`Http status error: ${response.status}`);
    }

    // Api error
    if (response.data.status !== '1') {
      debug.log(response.data, 'interact');
      throw new Error(`Etherscan api error: ${response.data.result}`);
    }

    return response.data.result;
  }
}

module.exports = EtherscanApi;
