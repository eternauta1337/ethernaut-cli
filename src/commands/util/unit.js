const { Command, Option } = require('commander');
const {
  InteractiveOption,
} = require('../../internal/interactive/interactive-option');
const ethers = require('ethers');
const logger = require('../../internal/logger');

const command = new Command();

const units = ['wei', 'ether', 'kwei', 'mwei', 'gwei', 'szabo', 'finney'];

command
  .name('unit')
  .description('Converts between different units of Ether')
  .argument('<value>', 'Value to convert')
  .addOption(
    new InteractiveOption('-f, --from <from>', 'Convert from this unit')
      .choices(units)
      .preferred('ether')
  )
  .addOption(
    new InteractiveOption('-d, --to <to>', 'Convert to this unit')
      .choices(units)
      .preferred('wei')
  )
  .action(async (value, options) => {
    const valueWei = ethers.utils.parseUnits(value, options.from);
    let result = ethers.utils.formatUnits(valueWei, options.to);

    const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/;
    result = result.match(removeTrailingZeroes)[1];

    logger.output(`${value} ${options.from} to ${options.to} is <${result}>`);
  });

module.exports = command;
