const axios = require('axios');
const logger = require('common/logger');

class EtherscanApi {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getContractAbi(address) {
    const result = await this.createRequest({
      module: 'contract',
      action: 'getabi',
      address,
    });

    return JSON.parse(result);
  }

  async getContractCode(address) {
    const result = await this.createRequest({
      module: 'contract',
      action: 'getsourcecode',
      address,
    });

    const data = result[0];

    if (data.ABI === 'Contract source code not verified') {
      logger.error('Contract source code not verified');
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

    if (response.status !== 200) {
      logger.error('Error fetching data from Etherscan');
    }

    return response.data.result;
  }
}

module.exports = EtherscanApi;
