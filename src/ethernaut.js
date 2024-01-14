const { Command } = require('commander');
const { makeInteractive, pickSubCommand } = require('./utils/interactive');
const addCommands = require('./utils/add-commands');

const command = new Command();

command
  .name('ethernaut')
  .description('Ethereum swiss army knife/game/tool/superweapon')
  .version('1.0.0') // TODO: Read from package.json
  .action(async () => {
    pickSubCommand(command);
  });

addCommands('commands', command);

command.pickSubCommandPrompt = 'Pick a bundle';
makeInteractive(command);

command.parse(process.argv);
