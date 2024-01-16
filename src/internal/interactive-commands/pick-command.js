const { jumpBack } = require('./jump-back');
const { prompt } = require('./prompt');
const { nameAndDescription } = require('./messages');

async function pickCommand(command) {
  const choices = command.commands.map((c) => {
    const hasSubcommands = c.commands.length > 0;
    const name = hasSubcommands ? `${c.name()} [+]` : c.name();

    return {
      title: nameAndDescription(name, c.description()),
      value: c.name(),
    };
  });

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
