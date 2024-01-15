const prompts = require('prompts');
const chalk = require('chalk');

function makeInteractive(command) {
  // Makes -i in a multi-command like 'app util unit -i'
  // apply to all subcommands
  command.enablePositionalOptions();

  // Set all required arguments as optional
  command.registeredArguments.forEach((arg) => {
    // console.log(arg);
    arg.required = false;

    // Mark arguments that should be skipped in interactive mode with *
    // If the argument name ends with *, set skip to true and remove * from the name
    if (arg._name.endsWith('*')) {
      arg.skip = true;
      arg._name = arg._name.slice(0, -1);
    }
  });

  // Intercept the action handler
  // Collects arguments before executing the original action.
  const originalActionHandler = command._actionHandler;
  command.action(async (...args) => {
    // args is [...actionArgs, options, command]
    const expectedArgsCount = command.registeredArguments.length;
    const actionArgs = args.slice(0, expectedArgsCount);
    const options = args.slice(-2)[0];

    if (options.interactive || command.commands.length > 0) {
      if (command.commands.length > 0) {
        // Run the action handler with the original args and options
        await originalActionHandler.apply(command, [actionArgs]);

        // This command has subcommands, so we'll use prompts to select one
        await pickSubCommand(command);
      } else {
        // This is an end command, so we'll populate its arguments and options

        const newArgs = await pickArguments(command);
        // console.log('newArgs', newArgs);
        // If the user cancelled any prompts, jump back or exit, except when arguments can be skipped
        for (let i = 0; i < command._args.length; i++) {
          const arg = command._args[i];
          const newArg = newArgs.length > i ? newArgs[i] : undefined;

          if (newArg === undefined && !arg.skip) {
            await jumpBack(command);
            return;
          }
        }

        const newOpts = await pickOptions(command);
        // console.log('newOpts', newOpts);
        // If the user cancelled any prompts, jump back or exit
        if (Object.values(newOpts).some((opt) => opt === undefined)) {
          await jumpBack(command);
          return;
        }

        // Run the action handler with the modified args and options
        command._optionValues = newOpts;
        await originalActionHandler.apply(command, [newArgs]);

        // After running the action in interactive mode,
        // jump back to the parent command
        await jumpBack(command);
      }
    } else {
      // Run the action handler with the original args and options
      await originalActionHandler.apply(command, [actionArgs]);
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

    // User cancelled prompt
    if (result === undefined) {
      break; // Stop picking args
    }
  }

  return args;
}

async function pickOptions(command) {
  const opts = { interactive: true };

  for (const opt of command.options) {
    // console.log(opt);

    const name = opt.long.split('--')[1];
    if (name === 'interactive') continue;

    let result;
    if (opt.argChoices) {
      result = await prompts([
        {
          type: 'select',
          initial: opt.argChoices.indexOf(opt.defaultValue),
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
          choices: opt.argChoices,
        },
      ]);

      opts[name] = opt.argChoices[result.selected];
    } else {
      result = await prompts([
        {
          type: 'toggle',
          initial: opt.defaultValue,
          name: 'selected',
          message: `${name}${chalk.gray(' ' + opt.description)}`,
          active: 'yes',
          inactive: 'no',
        },
      ]);

      opts[name] = result.selected;
    }

    // User cancelled prompt
    if (result === undefined) {
      break; // Stop picking options
    }
  }

  return opts;
}

async function pickSubCommand(command) {
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
    selectedCommand.parseAsync(['node', selected, '-i']);
  }
}

async function jumpBack(command) {
  if (command.parent) {
    await command.parent.parseAsync(['node', command.parent.name(), '-i']);
  } else {
    throw new Error('Cannot jump back from root command');
  }
}

module.exports = {
  makeInteractive,
  pickSubCommand,
};
