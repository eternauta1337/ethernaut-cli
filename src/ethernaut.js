const { Command } = require('commander');
const util = require('./commands/util/util');
const play = require('./commands/play/play');
const { makeInteractive } = require('./utils/interactive');

const ethernaut = new Command();

ethernaut
  .name('ethernaut')
  .description('Ethereum swiss army knife/game/tool/superweapon')
  .version('1.0.0') // TODO: Read from package.json
  .action(async () => {});

ethernaut.addCommand(util);
ethernaut.addCommand(play);

ethernaut.pickSubCommandPrompt = 'Pick a task';
makeInteractive(ethernaut);

ethernaut.parse(process.argv);
