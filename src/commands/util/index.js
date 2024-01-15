const { Command } = require('commander');
const { pickSubCommand } = require('../../internal/interactive');

const command = new Command();

command
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async () => {
    pickSubCommand(command);
  });

module.exports = command;
