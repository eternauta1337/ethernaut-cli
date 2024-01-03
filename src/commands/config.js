const { Command } = require('commander');
const addCommands = require('../utils/add-commands');
const { pickSubCommand } = require('../utils/interactive');

const command = new Command();

command
  .name('config')
  .description('Configure the Ethernaut CLI')
  .action(async () => {
    pickSubCommand(command);
  });

addCommands('commands/config', command);

command.pickSubCommandPrompt = 'What do you want to configure';

module.exports = command;
