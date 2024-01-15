const { Command } = require('commander');
const { pickSubCommand } = require('../../utils/interactive');

const command = new Command();

command
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async () => {
    pickSubCommand(command);
  });

command.pickSubCommandPrompt = 'Pick a util';

module.exports = command;
