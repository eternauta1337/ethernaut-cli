const { Command, Option } = require('commander');
const ethers = require('ethers');
const { copy } = require('copy-paste');

const unit = new Command();

const units = ['wei', 'ether', 'kwei', 'mwei', 'gwei', 'szabo', 'finney'];

unit
  .name('unit')
  .description('Converts between different units of Ether')
  .argument('[value]', 'Value to convert')
  .addOption(
    new Option('-s, --source <sourceUnit>', 'Convert from this unit')
      .default('ether')
      .choices(units)
  )
  .addOption(
    new Option('-d, --dest <destUnit>', 'Convert to this unit')
      .default('wei')
      .choices(units)
  )
  .action(async (value, options) => {
    const valueWei = ethers.utils.parseUnits(value, options.source);
    let result = ethers.utils.formatUnits(valueWei, options.dest);

    const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/;
    result = result.match(removeTrailingZeroes)[1];

    copy(result, () => {});

    console.log(
      `${value} ${options.source} to ${options.dest}:\n${result}\n(copied to clipboard)`
    );
  });

module.exports = unit;
