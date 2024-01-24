const { Command } = require('commander');
const { storage } = require('../../internal/storage');
const chalk = require('chalk');

const command = new Command();

command
  .name('show')
  .description('Show all current config properties')
  .action(async () => {
    console.log(chalk.blue.bold('----------------------'));
    console.log(chalk.blue.bold('Current configuration:'));
    console.log(chalk.blue.bold('----------------------'));
    console.log(chalk.gray(`- Provider: ${storage.config.provider.current}`));
    console.log(chalk.blue.bold('----------------------'));
  });

module.exports = command;
