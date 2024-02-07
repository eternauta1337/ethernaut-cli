const storage = require('../../internal/storage');
const EtherscanApi = require('../../internal/etherscan');
const { Select, AutoComplete } = require('enquirer');
const suggest = require('common/enquirer-suggest');

module.exports = async function prompt({ hre, address }) {
  let abiPath;

  const network = hre.network.config.name || hre.network.name;

  // Try to deduce the abi from previous interactions
  // in the current network
  if (address) {
    abiPath = deduceAbiFromAddress(address, network);
    if (abiPath) return abiPath;
  }

  // Start collecting the available strategies for the user to pick
  const choices = [];
  let choice;

  // Pick one one from known abis?
  const knownAbiFiles = storage.readAbiFiles();
  if (knownAbiFiles.length > 0) {
    choices.push({
      message: 'Browse known ABIs',
      value: 0,
    });
  }

  // Fetch from Etherscan?
  if (address) {
    choices.push({
      message: 'Fetch from Etherscan',
      value: 1,
    });
  }

  // Show prompt
  if (choices.length > 1) {
    const prompt = new Select({
      message: 'How would you like to specify an ABI?',
      choices,
    });

    choice = await prompt.run().catch(() => process.exit(0));
  }
  // Or pick the only available option
  else if (choices.length === 1) {
    choice = choices[0].value;
  }
  // Or exit quietly if no options are available
  else if (choices.length === 0) {
    return;
  }

  // Execute the chosen strategy
  switch (choice) {
    case 0:
      return await browseKnwonAbis(knownAbiFiles);
    case 1:
      return await getAbiFromEtherscan(address, network);
  }
};

async function browseKnwonAbis(abiFiles) {
  const choices = abiFiles.map((file) => ({
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

function deduceAbiFromAddress(address, network) {
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
