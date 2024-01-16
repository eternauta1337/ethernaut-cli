const chalk = require('chalk');
const { prompt } = require('./prompt');

async function pickArguments(args, command) {
  const newArgs = [];

  for (let i = 0; i < command._args.length; i++) {
    const arg = command._args[i];
    const value = args[i];

    if (value !== undefined) {
      newArgs.push(value);
      continue;
    }

    // Skip optional arguments
    if (arg.skip) {
      newArgs.push(undefined);
      continue;
    }

    const result = await prompt({
      type: arg.argChoices ? 'select' : 'text',
      message: `${arg._name}${chalk.gray(' ' + arg.description)}`,
      choices: arg.argChoices,
    });

    newArgs.push(result);
  }

  return newArgs;
}

module.exports = {
  pickArguments,
};
