const chalk = require('chalk');
const { prompt } = require('./prompt');
const { nameAndDescription } = require('./messages');

async function pickOptions(opts, command) {
  const newOpts = { interactive: true };

  for (const opt of command.options) {
    // console.log(opt);

    const name = opt.long.split('--')[1];

    if (opts[name] !== undefined) {
      newOpts[name] = opts[name];
      continue;
    }

    const result = await prompt({
      type: opt.argChoices ? 'autocomplete' : 'text',
      message: nameAndDescription(opt.name(), opt.description),
      choices: opt.argChoices,
    });

    newOpts[name] = result;
  }

  return newOpts;
}

module.exports = {
  pickOptions,
};
