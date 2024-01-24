const { Command } = require('commander');

const command = new Command();

command
  .name('config')
  .description('Configure the Ethernaut CLI')
  .action(async () => {});

module.exports = command;
