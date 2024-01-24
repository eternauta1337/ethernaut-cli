require('dotenv').config();
require('module-alias/register');

const { addCompletionSpecCommand } = require('@fig/complete-commander');
const { Command } = require('commander');
const {
  makeInteractive,
} = require('@src/internal/interactive/make-interactive');
const { addCommands } = require('@src/internal/add-commands');
const { parseArgv } = require('@src/internal/interactive/parse-argv');

const program = new Command();

program
  .name('ethernaut')
  .description('Ethereum swiss army knife/game/tool/superweapon')
  .version('1.0.0'); // TODO: Read from package.json

addCommands('commands', program);
makeInteractive(program);

addCompletionSpecCommand(program);

parseArgv(program);
