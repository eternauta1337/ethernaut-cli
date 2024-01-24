const { Command } = require('commander');

const command = new Command();

command.name('config').description('Configure the CLI').usage('<command>');

module.exports = command;
