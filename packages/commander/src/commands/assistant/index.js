const { Command } = require('commander');

const command = new Command();

command.name('assistant').description('CLI Ai assistant');

module.exports = command;
