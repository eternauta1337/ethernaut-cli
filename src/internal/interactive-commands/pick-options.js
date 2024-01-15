const chalk = require('chalk');
const prompts = require('prompts');

async function pickOptions(command) {
  const opts = { interactive: true };

  for (const opt of command.options) {
    // console.log(opt);

    const name = opt.long.split('--')[1];
    if (name === 'interactive') continue;

    let type = 'toggle';
    if (opt.argChoices) type = 'select';
    else {
      if (opt.defaultValue !== undefined) {
        if (typeof opt.defaultValue === 'boolean') type = 'toggle';
        else type = 'text';
      }
    }

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

      opts[name] = result.selected;
    } else if (type === 'text') {
      result = await prompts([
        {
          type: 'text',
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
        },
      ]);

      opts[name] = result.selected;
    } else if (type === 'select') {
      result = await prompts([
        {
          type: 'select',
          initial: opt.argChoices.indexOf(opt.defaultValue),
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
          choices: opt.argChoices,
        },
      ]);

      opts[name] = opt.argChoices[result.selected];
    }

    if (result.selected === undefined) {
      process.exit(0);
    }
  }

  return opts;
}

module.exports = {
  pickOptions,
};
