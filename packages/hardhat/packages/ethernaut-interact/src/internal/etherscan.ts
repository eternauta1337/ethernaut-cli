import axios, { AxiosRequestConfig } from "axios";

// https://docs.etherscan.io/getting-started/endpoint-urls

export default class EtherscanApi {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getContractAbi(address: string): Promise<any> {
    const result = await this.createRequest({
      module: "contract",
      action: "getabi",
      address,
    });

    return JSON.parse(result);
  }

  async getContractCode(address: string): Promise<any> {
    const result = await this.createRequest({
      module: "contract",
      action: "getsourcecode",
      address,
    });

    const data = result[0];

    if (data.ABI === "Contract source code not verified") {
      throw new Error("Contract source code not verified");
    }

    data.ABI = JSON.parse(data.ABI);

    return data;
  }

  private serializeParams(params: Record<string, any>): string {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
  }

  private async createRequest(params: Record<string, any> = {}): Promise<any> {
    const url = `${this.baseUrl}/api`;
    const serializedParams = this.serializeParams({
      ...params,
      apiKey: this.apiKey,
    });

    const config: AxiosRequestConfig = {
      method: "POST",
      url,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      data: serializedParams,
      responseType: "json",
    };

    const response = await axios(config);

    if (response.status !== 200) {
      throw new Error("Error fetching data from Etherscan");
    }

    return response.data.result;
  }
}
