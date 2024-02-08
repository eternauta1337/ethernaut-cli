const storage = require('../../internal/storage');
const EtherscanApi = require('../../internal/etherscan');
const { Select, AutoComplete } = require('enquirer');
const suggest = require('common/enquirer-suggest');
const spinner = require('common/spinner');
const debug = require('common/debugger');

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
  let choice;
  const choices = [];
  const options = {
    ETHERSCAN: 'Fetch from Etherscan',
    BROWSE: 'Browse known ABIs',
  };

  // Pick one one from known abis?
  const knownAbiFiles = storage.readAbiFiles();
  debug.log(`Known ABI files: ${knownAbiFiles.length}`, 'interact');
  if (knownAbiFiles.length > 0) {
    choices.push(options.BROWSE);
  }

  // Fetch from Etherscan?
  if (address) {
    choices.push(options.ETHERSCAN);
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
    choice = choices[0];
  }
  // Or exit quietly if no options are available
  else if (choices.length === 0) {
    debug.log('No ABI strategies available', 'interact');
    return;
  }

  // Execute the chosen strategy
  switch (choice) {
    case options.BROWSE:
      return await browseKnwonAbis(knownAbiFiles);
    case options.ETHERSCAN:
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
  spinner.progress('Fetching ABI from Etherscan...', 'etherscan');

  const networkComp = network === 'mainnet' ? '' : `-${network}`;

  const etherscan = new EtherscanApi(
    process.env.ETHERSCAN_API_KEY,
    `https://api${networkComp}.etherscan.io`
  );

  const info = await etherscan.getContractCode(address).catch((e) => {});
  if (info) {
    spinner.success('Abi fetched from Etherscan', 'etherscan');
  } else {
    spinner.fail('Unable to fetch ABI from Etherscan', 'etherscan');
    return;
  }

  const abiPath = storage.storeAbi(info.ContractName, info.ABI);

  return abiPath;
}
