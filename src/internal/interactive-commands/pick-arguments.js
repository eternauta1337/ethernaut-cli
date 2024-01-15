const chalk = require('chalk');
const prompts = require('prompts');

async function pickArguments(command) {
  const args = [];

  for (const arg of command._args) {
    // console.log(arg);

    // Skip optional arguments
    if (arg.skip) {
      args.push(undefined);
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

      args.push(result.selected);
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

      args.push(arg.argChoices[result.selected]);
    }

    if (result.selected === undefined) {
      process.exit(0);
    }
  }

  return args;
}

module.exports = {
  pickArguments,
};
