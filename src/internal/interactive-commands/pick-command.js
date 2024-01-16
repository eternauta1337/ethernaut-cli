const chalk = require('chalk');
const prompts = require('prompts');
const { jumpBack } = require('./jump-back');

async function pickCommand(command) {
  const choices = command.commands.map((c) => ({
    title: `${c.name()}${chalk.gray(' ' + c.description())}`,
    value: c.name(),
  }));

  const backTitle = '↩ back';
  if (command.parent) {
    choices.unshift({ title: backTitle, value: undefined });
  }

  const { selected } = await prompts([
    {
      type: 'autocomplete',
      name: 'selected',
      message: 'Pick a command',
      choices,
    },
  ]);

  if (selected === undefined) {
    process.exit(0);
  }

  if (selected === backTitle) {
    await jumpBack(command);
  } else {
    const selectedCommand = command.commands.find((c) => c.name() === selected);
    selectedCommand.parseAsync(['node', selected]);
  }
}

module.exports = {
  pickCommand,
};
