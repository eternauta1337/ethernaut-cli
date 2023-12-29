const prompts = require('prompts');

function makeInteractive(command) {
  // Makes -i in a multi-command like 'app util unit -i'
  // apply to all subcommands
  command.enablePositionalOptions();

  // Intercept the action handler
  const originalActionHandler = command._actionHandler;
  command.action(async (...args) => {
    // args is [...actionArgs, options, command]
    const expectedArgsCount = command.registeredArguments.length;
    const actionArgs = args.slice(0, expectedArgsCount);
    const options = args.slice(-2)[0];

    if (options.interactive) {
      if (command.commands.length > 0) {
        // This command has subcommands, so we'll use prompts to select one
        await pickSubCommand(command);
      } else {
        // This is an end command, so we'll populate its arguments and options
        const newArgs = await pickArguments(command);
        const newOpts = await pickOptions(command);
        command._optionValues = newOpts;
        originalActionHandler.apply(command, [newArgs]);
      }
    } else {
      originalActionHandler.apply(command, [actionArgs]);
    }
  });

  // Make sure subcommands have an interactive option too
  command.option('-i, --interactive', 'Enter interactive mode');

  // Make subcommands interactive
  command.commands.forEach((c) => makeInteractive(c));

  return command;
}

async function pickArguments(command) {
  const args = [];

  for (const arg of command._args) {
    const { value } = await prompts([
      { type: 'text', name: 'value', message: arg._name },
    ]);

    if (value === undefined) process.exit(0);

    args.push(value);
  }

  return args;
}

async function pickOptions(command) {
  const opts = { interactive: true };

  for (const opt of command.options) {
    const name = opt.long.split('--')[1];
    if (name === 'interactive') continue;

    const { result } = await prompts([
      {
        type: 'select',
        initial: opt.argChoices.indexOf(opt.defaultValue),
        name: 'result',
        message: opt.long,
        choices: opt.argChoices,
      },
    ]);

    if (result === undefined) process.exit(0);

    opts[name] = opt.argChoices[result];
  }

  return opts;
}

async function pickSubCommand(command) {
  const choices = command.commands.map((c) => ({
    title: c.name(),
  }));

  const { commandName } = await prompts([
    {
      type: 'autocomplete',
      name: 'commandName',
      message: command.pickSubCommandPrompt || 'Pick a command',
      choices,
    },
  ]);

  if (commandName === undefined) process.exit(0);

  const selectedCommand = command.commands.find(
    (c) => c.name() === commandName
  );

  selectedCommand.parseAsync(['node', commandName, '-i']);
}

module.exports = {
  makeInteractive,
};
