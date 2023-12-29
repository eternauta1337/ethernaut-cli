const { Command, Option } = require('commander');

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
    console.log('\nunit');
    console.log('value', value);
    console.log('options', options);

    // TODO: Implement
  });

module.exports = unit;
