const storage = require('../../internal/storage');
const EtherscanApi = require('../../internal/etherscan');

module.exports = async function prompt({ address }) {
  // TODO: Decide strategy to get abi from provided params
  // - DONE Get abi from Etherscan
  // - Deduce ABI from previous interaction
  // Might need to ask the user
  return await getAbiFromEtherscan(address, 'sepolia');
};

async function getAbiFromEtherscan(address, network) {
  const networkComp = network === 'mainnet' ? '' : `-${network}`;

  const etherscan = new EtherscanApi(
    process.env.ETHERSCAN_API_KEY,
    `https://api${networkComp}.etherscan.io`
  );

  const info = await etherscan.getContractCode(address);

  const abiPath = storage.storeAbi(info.ContractName, info.ABI);
  storage.rememberAbiAndAddress(info.ContractName, address, network);

  return abiPath;
}
