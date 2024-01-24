const { Command } = require('commander');

const command = new Command();

command
  .name('provider')
  .description('Configure the network provider')
  .usage('<command>');

module.exports = command;
