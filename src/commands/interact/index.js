const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const logger = require('@src/internal/logger');
const { getProvider } = require('@src/internal/get-provider');
const isAddress = require('@src/internal/is-address');
const { storage } = require('@src/internal/storage');
const spinner = require('../../internal/spinner');
const { prompt } = require('../../internal/interactive/prompt');
const EtherscanApi = require('../../internal/etherscan');

const ABIS_FOLDER_PATH = path.join(__dirname, '../../../', 'storage', 'abis');

const command = new Command();

command
  .name('interact')
  .description('Interacts with a contract')
  .argument('[nameOrAddress]', 'The name or address of the contract')
  .action(async (nameOrAddress) => {
    if (nameOrAddress === undefined) {
      logger.error(
        'You must provide either the name or address of the contract you want to interact with'
      );
      return;
    }

    // const provider = await getProvider();
    // const network = await provider.getNetwork();
    const network = { name: 'sepolia' };
    logger.debug('Network:', network.name);

    const abi = await findAbi(nameOrAddress, network);
    if (abi === undefined) {
      logger.error('Unable to find contract abi');
      return;
    }
    // console.log(abi);

    // TODO: Start interaction
  });

async function findAbi(nameOrAddress, network) {
  let name, address;
  if (isAddress(nameOrAddress)) {
    address = nameOrAddress;
  } else {
    name = nameOrAddress;
  }

  if (name) {
    address = await findAddressFromName(name, network.name);
    if (!address) return;
  } else {
    name = await findNameFromAddress(address, network.name);
    if (!name) {
      ({ name } = await findContractOnEtherscan(address, network.name));
    }
    if (!name) return;
  }
  // console.log(`Resolved name: ${name}, address: ${address}`);

  // Note: Name, address, and abi should be available at this point

  let abi = readAbi(name);
  if (abi === undefined) {
    ({ abi } = await findContractOnEtherscan(address, network.name));
  }

  return abi;
}

async function findContractOnEtherscan(address, networkName) {
  // Must have an api key
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (apiKey === undefined) {
    logger.warn(
      'Please set the environment variable ETHERSCAN_API_KEY to allow the program to find contracts on Etherscan'
    );
    return;
  }

  // Start the client
  const networkComp = networkName === 'mainnet' ? '' : `-${networkName}`;
  const etherscan = new EtherscanApi(
    apiKey,
    `https://api${networkComp}.etherscan.io`
  );

  // Fetch the contract info
  await spinner.show('Finding contract on Etherscan...');
  const contractInfo = await etherscan.getContractCode(address);
  if (contractInfo === undefined) {
    await spinner.stop('Contract not found on Etherscan', false);
    return;
  }
  await spinner.stop('Contract found on Etherscan');
  // console.log(contractInfo);

  // Remember the address and name
  const name = contractInfo.ContractName;
  const networkAddresses = getAddressesForNetwork(networkName);
  networkAddresses[name] = [address];

  // Remember the abi
  const abi = contractInfo.ABI;
  saveAbi(name, abi);

  return {
    name,
    abi,
  };
}

function createAbiDirIfNeeded() {
  if (!fs.existsSync(ABIS_FOLDER_PATH)) {
    fs.mkdirSync(ABIS_FOLDER_PATH, { recursive: true });
  }
}

function saveAbi(name, abi) {
  createAbiDirIfNeeded();

  // Convert ABI object to JSON
  const abiJson = JSON.stringify(abi, null, 2);

  // Save ABI JSON to a file in the "abis" directory
  const filePath = path.join(ABIS_FOLDER_PATH, `${name}.json`);
  fs.writeFileSync(filePath, abiJson);
}

function readAbi(name) {
  createAbiDirIfNeeded();

  const filePath = path.join(ABIS_FOLDER_PATH, `${name}.json`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    logger.error('Abi file not found');
    return;
  }

  // Read file
  const abiJson = fs.readFileSync(filePath, 'utf8');

  // Parse JSON string to an object
  const abi = JSON.parse(abiJson);

  return abi;
}

async function findAddressFromName(name, networkName) {
  const networkAddresses = getAddressesForNetwork(networkName);
  // Exit if there's no entry for the name
  let contractAddresses = networkAddresses[name];
  if (contractAddresses === undefined) {
    return undefined;
  }

  // Exit if the entry is an empty array
  if (contractAddresses.length === 0) {
    return undefined;
  }

  // If there's only one address, return it
  if (contractAddresses.length === 1) {
    return contractAddresses[0];
  }

  // If there's more than one address, prompt the user to select one
  if (contractAddresses.length > 1) {
    logger.warn(`Multiple addresses found for ${name}`);
    const response = await prompt({
      type: 'select',
      message: 'Select an address',
      choices: contractAddresses.concat([]),
    });
    return response;
  }
}

function findNameFromAddress(address, networkName) {
  const networkAddresses = getAddressesForNetwork(networkName);

  // Return the name of the first entry that contains the address
  for (const contractName in networkAddresses) {
    if (networkAddresses[contractName].includes(address)) {
      return contractName;
    }
  }
}

function getAddressesForNetwork(networkName) {
  let networkAddresses = storage.addresses[networkName];

  // Ensure that there's an entry for the network
  if (networkAddresses === undefined) {
    networkAddresses = storage.addresses[networkName] = {};
  }

  return networkAddresses;
}

module.exports = command;
