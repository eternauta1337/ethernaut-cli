const { Command } = require('commander');
const { makeInteractive, pickSubCommand } = require('./internal/interactive');
const addSubCommandsInFolder = require('./internal/add-commands');

const program = new Command();

program
  .name('ethernaut')
  .description('Ethereum swiss army knife/game/tool/superweapon')
  .version('1.0.0') // TODO: Read from package.json
  .action(async () => {
    pickSubCommand(program);
  });

addSubCommandsInFolder('commands', program);

makeInteractive(program);

program.parse(process.argv);
