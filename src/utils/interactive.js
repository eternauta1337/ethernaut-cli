const prompts = require('prompts');
const Fuse = require('fuse.js');

async function pickSubCommand(command) {
  const commandNames = command.commands.map((c) => c.name());
  const fuse = new Fuse(commandNames, { keys: ['title'] });

  // Is fuse really needed? The autocomplete prompt seems to do the same thing
  const { result: commandName } = await prompts([
    {
      type: 'autocomplete',
      name: 'result',
      message: 'Pick a command',
      choices: commandNames,
      suggest: async (text) => {
        if (!text) return commandNames;
        return fuse.search(text).map((r) => r.item);
      },
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
