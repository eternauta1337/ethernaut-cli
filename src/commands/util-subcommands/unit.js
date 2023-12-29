const { Command, Option } = require('commander');
const ethers = require('ethers');
const { copyToClipboard } = require('../../utils/copy-to-clipboard');

const command = new Command();

const units = ['wei', 'ether', 'kwei', 'mwei', 'gwei', 'szabo', 'finney'];

command
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

    copyToClipboard(result);
    console.log(result);
  });

module.exports = command;
