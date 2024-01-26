const chalk = require('chalk');
const { prompt } = require('./prompt');
const { nameAndDescription } = require('./messages');

async function pickArguments(args, command) {
  // console.log('Picking arguments for command:', command.name(), args);
  // console.log(command._args);

  const newArgs = [];

  for (let i = 0; i < command._args.length; i++) {
    const arg = command._args[i];
    const value = args[i];
    // console.log(`Arg ${i}:`, arg, value);

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
      message: nameAndDescription(arg._name, arg.description),
      choices: arg.argChoices,
    });

    newArgs.push(result);

    if (result === undefined) break;
  }

  return newArgs;
}

module.exports = {
  pickArguments,
};
