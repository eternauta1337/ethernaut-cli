const { flattenCommands } = require('./flatten-commands');
const { log } = require('../logger/index');

async function parseInput(command, input) {
  let lastToken = '';
  let matchedCommand = command;
  let matchedOption = null;

  if (input) {
    const tokens = input.split(' ').filter((t) => t.trim() !== '');

    const subcommands = flattenCommands(command.commands);

    lastToken = tokens[tokens.length - 1];

    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];

      const matched = subcommands.find((command) => {
        return command.name() === token;
      });

      if (matched) {
        matchedCommand = matched;

        matchedOption = matchedCommand.options.find(
          (o) => o.long === lastToken
        );

        break;
      }
    }
  }

  return {
    matchedCommand,
    matchedOption,
    lastToken,
  };
}

module.exports = {
  parseInput,
};
