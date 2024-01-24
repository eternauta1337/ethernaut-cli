const { Command, Option } = require('commander');

const command = new Command();

const units = ['wei', 'gwei', 'ether'];

command
  .name('convert')
  .description('Convert values to and from different units and formats')
  .usage('<value> --from <type> --to <type>')
  .argument('<value>', 'The value to convert')
  .addOption(
    new Option('--from <type>', 'The type to convert from').choices(units)
  )
  .addOption(new Option('--to <type>', 'The type to convert to').choices(units))
  .action((value, options) => {
    process.stdout.write(
      `${value} ${options.from} to ${options.to} is ${10000000000000}`
    );
  });

module.exports = command;
