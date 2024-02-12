const { task: hreTask } = require('hardhat/config');
const prompt = require('common/prompt');
const getNodes = require('common/get-nodes');
const debug = require('common/debug');
const output = require('common/output');
const camelToKebabCase = require('common/kebab');

let _hre;

module.exports = function makeHreInteractive(hre) {
  _hre = hre;

  makeTasksInteractive(hre);
};

function makeTasksInteractive(scope) {
  getNodes(scope).forEach((node) => {
    if (node.isScope) {
      makeTasksInteractive(node);
    } else if (
      node.name !== 'help' ||
      node.name !== 'version' ||
      node.name !== 'navigate'
    ) {
      makeInteractive(node);
    }
  });
}

function makeInteractive(task) {
  if (
    task.name === 'help' ||
    task.name === 'version' ||
    task.name === 'navigate'
  ) {
    return;
  }
  debug.log(`Making task "${task.name}" interactive`, 'ui');

  // TODO: This wont really work until I can parse args
  // TODO: Ai doesn't know how to handle these
  // before extending the environment...
  // Rn it will throw if this flag is used
  // task.addFlag('nonInteractive', 'Disable interactivity', false);

  // Override the action so that we can
  // collect parameters from the user before runnint it
  const action = async (args, hre, runSuper) => {
    // const { nonInteractive } = args;

    // if (nonInteractive === false) {
    const newArgs = await collectParameters(args, task);

    args = { ...args, ...newArgs };

    // If parameters were collected, print out the call
    if (Object.values(newArgs).length > 0) {
      // output.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      // output.info(`${toCliSyntax(args, task)}`);
      // output.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      // TODO: This looks really nice but is hard to copy
      output.resultBox({
        title: 'Autocomplete',
        msgs: [toCliSyntax(args, task)],
        borderStyle: {
          topLeft: '+',
          topRight: '+',
          bottomLeft: '+',
          bottomRight: '+',
          vertical: ' ',
          horizontal: '~',
        },
        borderColor: 'gray',
      });
    }
    // }

    await runSuper(args, hre, runSuper);
  };

  // Complete the override by calling task()
  // at either the hre or the scope level
  if (task.scope !== undefined) {
    const scope = _hre.scopes[task.scope];
    scope.task(task.name, task.description, action);
  } else {
    hreTask(task.name, task.description, action);
  }
}

function toCliSyntax(args, task) {
  const name = task.scope ? `${task.scope} ${task.name}` : task.name;
  const printArgs = Object.entries(args)
    .map(([argName, value]) => {
      const isPositional = task.positionalParamDefinitions.some(
        (p) => p.name === argName
      );

      if (isPositional) {
        return value;
      } else {
        const isFlag = task.paramDefinitions[argName]?.isFlag;
        argName = camelToKebabCase(argName);
        if (isFlag) {
          if (value === true) return `--${argName}`;
          else return '';
        } else {
          if (value !== undefined) return `--${argName} '${value}'`;
          else return '';
        }
      }
    })
    .join(' ');

  return `ethernaut ${name} ${printArgs}`;
}

async function collectParameters(args, task) {
  // Put all params in an array
  // Combine positional and named parameters
  const paramDefinitions = task.positionalParamDefinitions.concat(
    Object.values(task.paramDefinitions)
  );

  // Prompt the user for parameters
  // that haven't been provided
  const newArgs = {};
  for (let param of paramDefinitions) {
    debug.log(
      `Collecting parameter "${param.name}" ${JSON.stringify(args)}"`,
      'ui'
    );

    // TODO: Handle flags
    if (param.isFlag) continue;

    // Skip if arg is already provided
    const arg = args[param.name];
    if (arg !== undefined) continue;

    // Does the parameter provide its own prompt?
    if (param.prompt) {
      debug.log(`Running custom prompt for "${param.name}"`, 'ui');

      newArgs[param.name] = await param.prompt({
        hre: _hre,
        name: param.name,
        description: param.description,
        ...args,
        ...newArgs,
      });

      debug.log(
        `Custom prompt for "${param.name}" collected "${newArgs[param.name]}"`,
        'ui'
      );

      if (newArgs[param.name] !== undefined) continue;
    }

    const description = param.description
      ? ` (${param.description.split('.')[0].substring(0, 150)})`
      : '';

    const response = await prompt({
      type: 'input',
      message: `Enter ${param.name}${description}:`,
      initial: param.defaultValue,
    });

    newArgs[param.name] = response;
  }

  return newArgs;
}
