const { Command } = require('commander');

const command = new Command();

command
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async () => {});

module.exports = command;
