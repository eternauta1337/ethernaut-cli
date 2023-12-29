const { Command } = require('commander');
const addCommands = require('../utils/add-commands');
const { pickSubCommand } = require('../utils/interactive');

const command = new Command();

command
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async () => {
    pickSubCommand(command);
  });

addCommands('commands/util-subcommands', command);

command.pickSubCommandPrompt = 'Pick a util';

module.exports = command;
