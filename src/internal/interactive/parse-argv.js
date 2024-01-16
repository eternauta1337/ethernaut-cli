const logger = require('../logger');
const { flattenCommands } = require('./flatten-commands');

/**
 * Enhances argv parsing so that a sub command can be called directly.
 *
 * E.g. if "unit" is a sub command of "util", then the following calls are equivalent:
 * `ethernaut util unit`
 * `ethernaut unit`
 */
function parseArgv(program) {
  const args = process.argv;

  if (args.length === 2) {
    return program.parse(args);
  }

  // Find the last command referenced in the args
  const flattenedCommands = flattenCommands(program.commands);
  const lastCommand = flattenedCommands
    .filter((c) => {
      return args.some((arg) => c._name === arg);
    })
    .pop();
  if (!lastCommand) {
    logger.error(`Command not found: ${args[2]}`);
    return;
  }
  let appArgs = args.slice(2, args.length);
  const lastCommandIdx = appArgs.indexOf(lastCommand._name);

  // Compare the correct command call path to the used path
  const callPath = getCommandCallPath(lastCommand);
  const usedPath = appArgs.slice(0, lastCommandIdx + 1);
  if (JSON.stringify(callPath) !== JSON.stringify(usedPath)) {
    // Correct the command call path
    appArgs = callPath.concat(
      appArgs.slice(lastCommandIdx + 1, appArgs.length)
    );
  }

  // Reinsert node and file name
  const processedArgs = args.slice(0, 2).concat(appArgs);

  // And finally process the args
  program.parse(processedArgs);
}

function getCommandCallPath(command) {
  if (command.parent) {
    return [...getCommandCallPath(command.parent), command._name];
  } else {
    return [];
  }
}

module.exports = {
  parseArgv,
};
