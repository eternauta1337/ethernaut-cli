const { pickCommand } = require('./pick-command');
const { pickArguments } = require('./pick-arguments');
const { pickOptions } = require('./pick-options');
const { jumpBack } = require('./jump-back');

/**
 * Makes a command interactive by:
 * - If the command has subcommands, it will prompt the user to select one
 * - If the command has arguments or options, it will prompt the user to enter them
 *
 * Making a command interactive will also make all subcommands interactive recursively.
 *
 * To skip an argument in interactive mode, add a * to the end of its name.
 *
 * Interactivity is implemented by wrapping the command's action handler with a function
 * that first collects the arguments and options using prompts,
 * and then executes the original action handler.
 */
function makeInteractive(command) {
  const originalActionHandler = command._actionHandler;

  const expectedArgsCount = command.registeredArguments.length;
  const hasSubCommands = command.commands.length > 0;

  command.action(async (...args) => {
    // args is [...actionArgs, options, command]

    const actionArgs = args.slice(0, expectedArgsCount);
    const options = args.slice(-2)[0];

    if (!options.interactive && !hasSubCommands) {
      // Run the action handler with the original args and options
      await originalActionHandler.apply(command, [actionArgs]);

      // And exit
      return;
    }

    if (hasSubCommands) {
      // Note that this doesn't care if -i was passed or not
      // Run the action handler with the original args and options
      await originalActionHandler.apply(command, [actionArgs]);

      // And pick a sub command interactively
      await pickCommand(command);
    }

    if (options.interactive) {
      // Collect args and options
      const newArgs = await pickArguments(command);
      const newOpts = await pickOptions(command);

      // Run the action handler with the modified args and options
      command._optionValues = newOpts;
      await originalActionHandler.apply(command, [newArgs]);

      // Jump back to the parent command
      await jumpBack(command);
    }
  });

  // Make sure subcommands have an interactive option too
  command.option('-i, --interactive', 'Enter interactive mode');

  // This is needed if we want an '-i' flag to apply to all subcommands
  command.enablePositionalOptions();

  // We can't have required arguments or else parsing will fail.
  // So, set all required arguments as optional
  // TODO: Introduce a way to skip arguments in interactive mode, except for those that were originally required
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

  // Also make all subcommands interactive
  command.commands.forEach((c) => makeInteractive(c));

  return command;
}

module.exports = {
  makeInteractive,
};
