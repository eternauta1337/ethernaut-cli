const chalk = require('chalk');
const prompts = require('prompts');

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

    let result;
    if (!arg.argChoices) {
      result = await prompts([
        {
          type: 'text',
          name: 'selected',
          message: `${arg._name}${chalk.gray(' ' + arg.description)}`,
        },
      ]);

      newArgs.push(result.selected);
    } else {
      result = await prompts([
        {
          type: 'select',
          initial: arg.defaultValue
            ? arg.argChoices.indexOf(arg.defaultValue)
            : '',
          name: 'selected',
          message: `${arg._name}${chalk.gray(' ' + arg.description)}`,
          choices: arg.argChoices,
        },
      ]);

      newArgs.push(arg.argChoices[result.selected]);
    }

    if (result.selected === undefined) {
      process.exit(0);
    }
  }

  return newArgs;
}

module.exports = {
  pickArguments,
};
