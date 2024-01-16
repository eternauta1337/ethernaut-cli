const { Command } = require('commander');

const command = new Command();

command.name('provider').description('Set an Ethereum provider');

module.exports = command;
