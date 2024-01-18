const { Command } = require('commander');
const logger = require('@src/internal/logger');
const { getProvider } = require('@src/internal/get-provider');
const findAbi = require('../../internal/find-abi');

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

    const provider = await getProvider();
    const network = await provider.getNetwork();
    logger.debug('Network:', network.name);

    let abi;
    try {
      abi = await findAbi(nameOrAddress, network);
    } catch (error) {
      logger.error(
        `Unable to find contract abi with the information provided: ${nameOrAddress} - ${error.message}`
      );
      return;
    }

    // TODO: Start interaction
  });

module.exports = command;
