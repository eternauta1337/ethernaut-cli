const { Command, Option } = require('commander');
const prompts = require('prompts');

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
    if (!value) {
      value = await pickArg('value');
      options = await pickOpts(unit);
    }

    console.log('unit', value, options);

    // TODO: Implement
  });

async function pickArg(name) {
  const { result } = await prompts([
    { type: 'text', name: 'result', message: name },
  ]);
  return result;
}

async function pickOpts(command) {
  const opts = {};

  for (const opt of command.options) {
    const name = opt.long.split('--')[1];
    const { result } = await prompts([
      {
        type: 'select',
        initial: opt.argChoices.indexOf(opt.defaultValue),
        name: 'result',
        message: opt.long,
        choices: opt.argChoices,
      },
    ]);

    opts[name] = opt.argChoices[result];
  }

  return opts;
}

module.exports = unit;
