const { prompt } = require('./prompt');
const { nameAndDescription } = require('./messages');
const { flattenCommands } = require('./flatten-commands');
const { getCommandCallPath } = require('./call-path');

async function pickCommand(command) {
  const flattenedCommands = flattenCommands(command.commands);

  const folderChar = '📁';
  const choices = flattenedCommands
    .map((c) => {
      const hasSubcommands = c.commands.length > 0;
      const name = hasSubcommands ? `${folderChar} ${c.name()}` : c.name();

      return {
        title: nameAndDescription(name, c.description()),
        value: c.name(),
      };
    })
    .sort(
      (a, b) => b.title.includes(folderChar) - a.title.includes(folderChar)
    );

  const parentTitle = '↩ up';
  const exitTitle = '↩ exit';
  if (command.parent) {
    choices.unshift({ title: parentTitle, value: undefined });
  } else {
    choices.unshift({ title: exitTitle, value: undefined });
  }

  const response = await prompt({
    type: 'autocomplete',
    message: ['ethernaut'].concat(getCommandCallPath(command)).join(' > '),
    choices,
  });

  if (response === undefined) {
    process.exit(0);
  }

  if (response === parentTitle) {
    if (command.parent) {
      await command.parent.parseAsync(['node', command.parent.name()]);
    }
  } else if (response === exitTitle) {
    process.exit(0);
  } else {
    const selectedCommand = flattenedCommands.find(
      (c) => c.name() === response
    );
    selectedCommand.parseAsync(['node', response]);
  }
}

module.exports = {
  pickCommand,
};
