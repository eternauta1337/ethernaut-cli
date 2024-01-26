const { flattenCommands } = require('../interactive/flatten-commands');
const { findRootCommand } = require('../commander/root-command');

function buildToolsSpec(someCommand) {
  const program = findRootCommand(someCommand);
  const commands = flattenCommands(program.commands);

  const tools = [];
  commands.forEach((command) => {
    tools.push({
      type: 'function',
      function: {
        name: command.name(),
        description: command.description(),
        parameters: collectParameters(command),
      },
    });
  });

  return tools;
}

function collectParameters(command) {
  const properties = {};
  const required = [];

  for (const argument of command.registeredArguments) {
    properties[argument._name] = {
      type: 'string',
      description: argument.description,
    };
    if (argument.originallyRequired) {
      required.push(argument._name);
    }
  }

  for (const option of command.options) {
    const name = `_${option.long.split('--')[1]}`;
    properties[name] = {
      type: 'string',
      description: option.description,
    };
    if (option.required) {
      required.push(name);
    }
  }

  return {
    type: 'object',
    properties,
    required,
  };
}

module.exports = {
  buildToolsSpec,
};
