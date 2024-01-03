const { Command } = require('commander');
const addCommands = require('../utils/add-commands');
const { pickSubCommand } = require('../utils/interactive');

const command = new Command();

command
  .name('play')
  .description('Play The Ethernaut on the CLI')
  .action(async () => {
    // pickSubCommand(command); // Uncomment when subcommands are added
  });

addCommands('commands/play', command);

command.pickSubCommandPrompt = 'Pick a level';

module.exports = command;
