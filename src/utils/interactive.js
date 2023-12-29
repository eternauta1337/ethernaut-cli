const prompts = require('prompts');

async function pickSubCommand(command) {
  const choices = command.commands.map((c) => ({
    title: c.name(),
  }));
  const { commandName } = await prompts([
    {
      type: 'autocomplete',
      name: 'commandName',
      message: 'Pick a command',
      choices,
    },
  ]);

  const selectedCommand = command.commands.find(
    (c) => c.name() === commandName
  );
  selectedCommand.parseAsync(['node', commandName]);
}

module.exports = {
  pickSubCommand,
};
