const prompts = require('prompts');
const chalk = require('chalk');

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
        // If the user cancelled any prompts, jump back or exit
        if (newArgs.some((arg) => arg === undefined)) {
          jumpBack(command);
          return;
        }
        // console.log('newArgs', newArgs);

        const newOpts = await pickOptions(command);
        // If the user cancelled any prompts, jump back or exit
        if (Object.values(newOpts).some((opt) => opt === undefined)) {
          jumpBack(command);
          return;
        }
        // console.log('newOpts', newOpts);

        // Run the action handler with the modified args and options
        command._optionValues = newOpts;
        originalActionHandler.apply(command, [newArgs]);

        // After running the action in interactive mode,
        // run it again indefinitely until the user cancels
        command.parseAsync(['node', command.name(), '-i']);
      }
    } else {
      // Run the action handler with the original args and options
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
    const { selected } = await prompts([
      {
        type: 'text',
        name: 'selected',
        message: `${arg._name} ${chalk.gray(arg.description)}`,
      },
    ]);

    args.push(selected);

    // User cancelled prompt
    if (selected === undefined) {
      break; // Stop picking args
    }
  }

  return args;
}

async function pickOptions(command) {
  const opts = { interactive: true };

  for (const opt of command.options) {
    const name = opt.long.split('--')[1];
    if (name === 'interactive') continue;

    const { selected } = await prompts([
      {
        type: 'select',
        initial: opt.argChoices.indexOf(opt.defaultValue),
        name: 'selected',
        message: `${name} ${chalk.gray(opt.description)}`,
        choices: opt.argChoices,
      },
    ]);

    opts[name] = opt.argChoices[selected];

    // User cancelled prompt
    if (selected === undefined) {
      break; // Stop picking options
    }
  }

  return opts;
}

async function pickSubCommand(command) {
  const choices = command.commands.map((c) => ({
    title: `${c.name()} ${chalk.gray(c.description())}`,
    value: c.name(),
  }));

  const { selected } = await prompts([
    {
      type: 'autocomplete',
      name: 'selected',
      message: command.pickSubCommandPrompt || 'Pick a command',
      choices,
    },
  ]);

  if (selected === undefined) {
    jumpBack(command);
  } else {
    const selectedCommand = command.commands.find((c) => c.name() === selected);
    selectedCommand.parseAsync(['node', selected, '-i']);
  }
}

function jumpBack(command) {
  if (command.parent) {
    command.parent.parseAsync(['node', command.parent.name(), '-i']);
  } else {
    process.exit(1);
  }
}

module.exports = {
  makeInteractive,
  pickSubCommand,
};
