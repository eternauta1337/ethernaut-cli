require('dotenv').config();

const { Command } = require('commander');
const logger = require('@src/internal/logger');
const { getProvider } = require('@src/internal/get-provider');
const isAddress = require('@src/internal/is-address');
const { storage } = require('@src/internal/storage');

const command = new Command();

command
  .name('interact')
  .description('Interacts with a contract')
  .argument('[nameOrAddress]', 'The name or address of the contract')
  .action(async (nameOrAddress) => {
    if (nameOrAddress === undefined) {
      logger.error('You must provide either a name or an address');
      return;
    }

    const { name, address } = await deduceNameAndAddress(nameOrAddress);

    // TODO: Get abi

    // TODO: Start interaction
  });

async function deduceNameAndAddress(nameOrAddress) {
  // const provider = await getProvider();
  // const network = await provider.getNetwork();
  const network = { name: 'sepolia' };
  // console.log(network);

  let name, address;
  if (isAddress(nameOrAddress)) {
    address = nameOrAddress;
  } else {
    name = nameOrAddress;
  }

  // If only an address is provided,
  // try to find the name in storage
  const networkAddresses = storage.addresses[network.name];
  console.log('addresses:', networkAddresses);
  if (address && !name) {
    for (const entry in networkAddresses) {
      if (networkAddresses[entry].includes(address)) {
        name = entry;
        break;
      }
    }
  }
  // TODO: Would hit etherscan here - but I don't like the code structure, feels ugly

  return {
    name,
    address,
  };
}

module.exports = command;
