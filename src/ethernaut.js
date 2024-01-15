const { Command } = require('commander');
const { makeInteractive, pickSubCommand } = require('./internal/interactive');
const {
  recursivelyAddSubCommandsInFolder,
} = require('./internal/add-commands');

const program = new Command();

program
  .name('ethernaut')
  .description('Ethereum swiss army knife/game/tool/superweapon')
  .version('1.0.0') // TODO: Read from package.json
  .action(async () => {
    pickSubCommand(program);
  });

recursivelyAddSubCommandsInFolder('commands', program);

makeInteractive(program);

program.parse(process.argv);
