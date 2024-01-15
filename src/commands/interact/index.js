const { Command, Option } = require('commander');
const logger = require('../../internal/logger');

const command = new Command();

command
  .name('interact')
  .description(
    'Interacts with a contract. If an address is provided, the abi will be looked up on Etherscan and remmebered for future use. If a name is provided, the address will be looked up locally from previous usages.'
  )
  .option('-a, --address [address]', 'The address of the contract', '')
  .option('-n, --name [name]', 'The name of the contract', '')
  .option('-p, --pp [pipu]', 'The name of the contract', false)
  .action(async (options) => {
    const { name, address } = options;

    if (!name && !address) {
      logger.error('Must provide either a name or an address');
      return;
    }

    if (!name || !address) {
      ({ name, address } = await deduceNameAndAddress(name, address));
    }

    // TODO: Get abi
  });

async function deduceNameAndAddress(name, address) {
  return {
    name: name || 'Unknown',
    address: address || '0xdead',
  };
}

module.exports = command;
