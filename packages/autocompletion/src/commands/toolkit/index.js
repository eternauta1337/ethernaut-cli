const { Command } = require('commander');

const command = new Command();

command
  .name('toolkit')
  .description('Everyday tools for ethernauts')
  .usage('<command>');

module.exports = command;
