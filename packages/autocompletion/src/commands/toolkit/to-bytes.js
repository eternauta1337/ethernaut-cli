const { Command } = require('commander');

const command = new Command();

command
  .name('to-bytes')
  .description('Convert values to bytes')
  .usage('<value>')
  .argument('<value>', 'The value to convert')
  .action((value, options) => {
    console.log(`Convert ${value} to string`);
  });

module.exports = command;
