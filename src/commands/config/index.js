const { Command } = require('commander');
const { pickSubCommand } = require('../../internal/interactive');

const command = new Command();

command
  .name('config')
  .description('Configure the Ethernaut CLI')
  .action(async () => {
    pickSubCommand(command);
  });

module.exports = command;
