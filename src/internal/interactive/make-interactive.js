const { pickCommand } = require('./pick-command');
const { pickArguments } = require('./pick-arguments');
const { pickOptions } = require('./pick-options');
const { jumpBack } = require('./jump-back');

/**
 * Makes a command interactive by:
 * - If the command has subcommands, prompting the user to pick one
 * - If the command has arguments or options, prompting the user to enter them
 *
 * Interactivity is implemented by wrapping the command's action handler with a function
 * that first collects the arguments and options using prompts,
 * and then executes the original action handler.
 *
 * Note: There is no interactive option. Any command with subcommands will trigger navigation,
 * and any command with incomplete arguments or options which can't be skipped will trigger prompts.
 *
 * Note: Required arguments or options will not be handled by interactive mode,
 * since commander throws when parsing, way before the action handler is called.
 *
 * Note: Interactivity is applied recursively to all subcommands.
 *
 * Special nomenclature:
 * '[myArg*]' - An argument that will be skipped in interactive mode
 */
function makeInteractive(command) {
  const originalActionHandler = command._actionHandler;

  const expectedArgsCount = command.registeredArguments.length;
  const hasSubCommands = command.commands.length > 0;

  command.action(async (...combinedArgs) => {
    // Note: combinedArgs is [...args, options, command]

    const args = combinedArgs.slice(0, expectedArgsCount);
    const opts = combinedArgs.slice(-2)[0];

    if (hasSubCommands) {
      // And pick a sub command interactively
      await pickCommand(command);

      return;
    }

    // Collect args and options
    const newArgs = await pickArguments(args, command);
    const newOpts = await pickOptions(opts, command);

    // Run the action handler with the modified args and options
    command._optionValues = newOpts;
    await originalActionHandler.apply(command, [newArgs]);
  });

  // We can't have required arguments or else parsing will fail.
  // So, set all required arguments as optional
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
