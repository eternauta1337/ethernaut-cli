const storage = require('../../internal/storage');
const EtherscanApi = require('../../internal/etherscan');
const { Select, AutoComplete } = require('enquirer');
const suggest = require('common/enquirer-suggest');
const spinner = require('common/spinner');
const debug = require('common/debugger');

const strategies = {
  ETHERSCAN: 'Fetch from Etherscan',
  BROWSE: 'Browse known ABIs',
  MANUAL: 'Enter path manually',
};

module.exports = async function prompt({ hre, address }) {
  try {
    let abiPath;

    const network = hre.network.config.name || hre.network.name;

    // Try to deduce the abi from previous interactions
    // in the current network
    if (address) {
      abiPath = deduceAbiFromAddress(address, network);
      if (abiPath) return abiPath;
    } else {
      debug.log('Cannot deduce from address', 'interact');
    }

    // Let the user select a strategy
    const choice = await selectStrategy({ address, network });
    debug.log(`Chosen strategy: ${choice}`, 'interact');

    // Execute the chosen strategy
    switch (choice) {
      case strategies.BROWSE:
        abiPath = await browseKnwonAbis();
        break;
      case strategies.ETHERSCAN:
        abiPath = await getAbiFromEtherscan(address, network);
        break;
      case strategies.MANUAL:
      // Do nothing
    }

    // Remember anything?
    // Note: The abi file is stored below when fetching from Etherscan
    if (abiPath && address) {
      storage.rememberAbiAndAddress(abiPath, address, network);
    }

    return abiPath;
  } catch (err) {
    debug.log(err, 'interact');
  }
};

async function selectStrategy({ address, network }) {
  // Collect available choices since
  // not all strategies might be available
  const choices = [strategies.MANUAL];

  // Pick one one from known abis?
  const knownAbiFiles = storage.readAbiFiles();
  debug.log(`Known ABI files: ${knownAbiFiles.length}`, 'interact');
  if (knownAbiFiles.length > 0) {
    choices.push(strategies.BROWSE);
  } else {
    debug.log('Cannot browse abis', 'interact');
  }

  // Fetch from Etherscan?
  if (address) {
    choices.push(strategies.ETHERSCAN);
  } else {
    debug.log('Cannot fetch from Etherscan', 'interact');
  }

  // No choices?
  if (choices.length === 0) {
    debug.log('No ABI strategies available', 'interact');
    return;
  }

  // A single choice?
  if (choices.length === 1) {
    debug.log(
      `Single strategy available (skipping prompt): ${choices[0]}`,
      'interact'
    );
    return choices[0];
  }

  // Show prompt
  debug.log(`Prompting for stragtegy - choices: ${choices}`, 'interact');
  const prompt = new Select({
    message: 'How would you like to specify an ABI?',
    choices,
  });

  return await prompt.run().catch(() => process.exit(0));
}

async function browseKnwonAbis() {
  const abiFiles = storage.readAbiFiles();

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
  if (!addresses) {
    debug.log(`No addresses found for ${network}`, 'interact');
    return undefined;
  }
  debug.log(
    `Found ${Object.keys(addresses).length} addresses on ${network}`,
    'interact'
  );

  const abiPath = addresses[address];
  if (!abiPath) {
    debug.log(
      `No address entry found for ${address} on ${network}`,
      'interact'
    );
    return;
  }

  debug.log(`Found ...${abiPath.split('/').pop()} for ${address}`, 'interact');

  return abiPath;
}

async function getAbiFromEtherscan(address, network) {
  spinner.progress('Fetching ABI from Etherscan...', 'etherscan');

  const networkComp = network === 'mainnet' ? '' : `-${network}`;

  const etherscan = new EtherscanApi(
    process.env.ETHERSCAN_API_KEY,
    `https://api${networkComp}.etherscan.io`
  );

  try {
    const info = await etherscan.getContractCode(address);
    const abiPath = storage.storeAbi(info.ContractName, info.ABI);

    spinner.success(
      `Abi fetched from Etherscan ${info.ContractName}`,
      'etherscan'
    );

    return abiPath;
  } catch (err) {
    spinner.fail(
      `Unable to fetch ABI from Etherscan: ${err.message}`,
      'etherscan'
    );

    debug.log(err.message, 'etherscan');
  }
}
