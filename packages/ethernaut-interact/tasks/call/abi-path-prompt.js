const storage = require('../../internal/storage');
const EtherscanApi = require('../../internal/etherscan');

module.exports = async function prompt({ hre, address }) {
  let abiPath;

  const network = hre.network.config.name || hre.network.name;

  abiPath = deduceAbiFromStorage(address, network);

  if (!abiPath) {
    abiPath = await getAbiFromEtherscan(address, network);
  }

  return abiPath;
};

function deduceAbiFromStorage(address, network) {
  const addresses = storage.readAddresses()[network];
  if (!addresses) return undefined;
  return addresses[address];
}

async function getAbiFromEtherscan(address, network) {
  console.log('Fetching ABI from Etherscan...');

  const networkComp = network === 'mainnet' ? '' : `-${network}`;

  const etherscan = new EtherscanApi(
    process.env.ETHERSCAN_API_KEY,
    `https://api${networkComp}.etherscan.io`
  );

  const info = await etherscan.getContractCode(address);

  const abiPath = storage.storeAbi(info.ContractName, info.ABI);
  storage.rememberAbiAndAddress(abiPath, address, network);

  return abiPath;
}
