const chalk = require('chalk');
const prompts = require('prompts');

async function pickOptions(opts, command) {
  const newOpts = { interactive: true };

  for (const opt of command.options) {
    // console.log(opt);

    const name = opt.long.split('--')[1];

    let type = 'toggle';
    if (opt.argChoices) type = 'select';
    else {
      if (opt.defaultValue !== undefined) {
        if (typeof opt.defaultValue === 'boolean') type = 'toggle';
        else type = 'text';
      }
    }
    console.log(type);

    let result;

    if (type === 'toggle') {
      result = await prompts([
        {
          type: 'toggle',
          initial: opt.defaultValue,
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
          active: 'yes',
          inactive: 'no',
        },
      ]);

      newOpts[name] = result.selected;
    } else if (type === 'text') {
      result = await prompts([
        {
          type: 'text',
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
        },
      ]);

      newOpts[name] = result.selected;
    } else if (type === 'select') {
      result = await prompts([
        {
          type: 'select',
          // initial: opt.argChoices.indexOf(opt.defaultValue),
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
          choices: opt.argChoices,
        },
      ]);
      console.log(result);

      newOpts[name] = opt.argChoices[result.selected];
    }

    if (result.selected === undefined) {
      process.exit(0);
    }
  }

  return newOpts;
}

module.exports = {
  pickOptions,
};
