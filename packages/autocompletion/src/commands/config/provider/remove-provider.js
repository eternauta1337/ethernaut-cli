const { Command } = require('commander');

const command = new Command();

command
  .name('remove-provider')
  .description('Choose a provider')
  .usage('<value>')
  .argument('<value>', 'The value to convert')
  .action((value, options) => {
    console.log(command.name());
  });

module.exports = command;
