const { Command } = require('commander');
const ethers = require('ethers');
const logger = require('../../utils/logger');
const { getProvider } = require('../../utils/get-provider');

const command = new Command();

command
  .name('level')
  .description('Plays an Ethernaut level')
  .argument('<level-name-or-address>', 'The name or the address of the level')
  .action(async (levelId) => {
    logger.info('Playing level:', levelId);

    // T

    // TODO: Implement the level playing logic here.
  });

module.exports = command;
