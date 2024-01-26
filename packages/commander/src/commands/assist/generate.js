const { Command } = require('commander');
const {
  flattenCommands,
} = require('../../internal/interactive/flatten-commands');

const command = new Command();

command
  .name('generate')
  .description('Generates a tool spec for the assitant')
  .action(async (args) => {
    const program = findRootCommand(command);
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

    console.log(JSON.stringify(tools, null, 2));
  });

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
    console.log(option);
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

function findRootCommand(command) {
  if (command.parent) {
    return findRootCommand(command.parent);
  }

  return command;
}

module.exports = command;
