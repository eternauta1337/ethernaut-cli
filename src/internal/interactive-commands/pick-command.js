const chalk = require('chalk');
const { jumpBack } = require('./jump-back');
const { prompt } = require('./prompt');

async function pickCommand(command) {
  const choices = command.commands.map((c) => ({
    title: `${c.name()}${chalk.gray(' ' + c.description())}`,
    value: c.name(),
  }));

  const backTitle = '↩ back';
  if (command.parent) {
    choices.unshift({ title: backTitle, value: undefined });
  }

  const response = await prompt({
    type: 'autocomplete',
    message: 'Pick a command',
    choices,
  });

  if (response === backTitle) {
    await jumpBack(command);
  } else {
    const selectedCommand = command.commands.find((c) => c.name() === response);
    selectedCommand.parseAsync(['node', response]);
  }
}

module.exports = {
  pickCommand,
};
