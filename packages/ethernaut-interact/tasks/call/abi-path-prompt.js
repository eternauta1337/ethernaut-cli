const storage = require('../../internal/storage');
const EtherscanApi = require('../../internal/etherscan');
const { Select, AutoComplete } = require('enquirer');
const suggest = require('common/enquirer-suggest');

module.exports = async function prompt({ hre, address }) {
  let abiPath;

  const network = hre.network.config.name || hre.network.name;

  abiPath = deduceAbiFromStorage(address, network);
  if (abiPath) return abiPath;

  // Let the user choose how to get the abi
  const choices = ['Fetch from Etherscan', 'Browse local ABIs'];
  const prompt = new Select({
    message: 'How would you like to specify an ABI?',
    choices: choices.concat(),
  });
  const response = await prompt.run().catch(() => process.exit(0));

  switch (response) {
    case choices[0]:
      return await getAbiFromEtherscan(address, network);
    case choices[1]:
      return await browseKnwonAbis();
    default:
      throw new Error('Unknown ABI source');
  }
};

async function browseKnwonAbis() {
  const choices = storage.readAbiFiles().map((file) => ({
    message: file.name,
    value: file.path,
  }));

  const prompt = new AutoComplete({
    message: 'Pick an ABI',
    limit: 15,
    choices: choices,
    suggest,
  });

  return await prompt.run().catch(() => process.exit(0));
}

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

  return abiPath;
}
