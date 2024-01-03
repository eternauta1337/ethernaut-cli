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
        // console.log('newArgs', newArgs);
        // If the user cancelled any prompts, jump back or exit
        // Non required arguments can be skipped
        for (let i = 0; i < command._args.length; i++) {
          const arg = command._args[i];
          const newArg = newArgs.length > i ? newArgs[i] : undefined;

          if (newArg === undefined && arg.required) {
            jumpBack(command);
            return;
          }
        }

        const newOpts = await pickOptions(command);
        // console.log('newOpts', newOpts);
        // If the user cancelled any prompts, jump back or exit
        if (Object.values(newOpts).some((opt) => opt === undefined)) {
          jumpBack(command);
          return;
        }

        // Run the action handler with the modified args and options
        command._optionValues = newOpts;
        await originalActionHandler.apply(command, [newArgs]);

        // After running the action in interactive mode,
        // jump back to the parent command
        jumpBack(command);
        // command.parseAsync(['node', command.name(), '-i']);
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
    // console.log(arg);

    // Skip optional arguments
    // if (!arg.required) {
    //   args.push(undefined);
    //   continue;
    // }

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
