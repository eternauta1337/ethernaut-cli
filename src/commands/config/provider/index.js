const { Command } = require('commander');

const command = new Command();

command.name('provider').description("Manage the CLI's Ethereum provider");

module.exports = command;
