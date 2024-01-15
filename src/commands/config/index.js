const { Command } = require('commander');
const { pickSubCommand } = require('../../utils/interactive');

const command = new Command();

command
  .name('config')
  .description('Configure the Ethernaut CLI')
  .action(async () => {
    pickSubCommand(command);
  });

command.pickSubCommandPrompt = 'What do you want to configure';

module.exports = command;
