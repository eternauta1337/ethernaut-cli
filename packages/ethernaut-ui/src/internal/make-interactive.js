const { task: hreTask } = require('hardhat/config');
const getNodes = require('common/src/get-nodes');
const debug = require('common/src/debug');
const output = require('common/src/output');
const camelToKebabCase = require('common/src/kebab');
const collectArguments = require('./collect-args');

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

  // TODO: Ai doesn't know how to handle flags
  // TODO: This wont really work until I can parse args
  // before extending the environment...
  // Rn it will throw if this flag is used
  // task.addFlag('nonInteractive', 'Disable interactivity', false);

  // Override the action so that we can
  // collect parameters from the user before runnint it
  const action = async (args, hre, runSuper) => {
    // const { nonInteractive } = args;

    // if (nonInteractive === false) {
    const collectedArgs = await collectArguments(args, task, _hre);
    args = { ...args, ...collectedArgs };

    // If parameters were collected, print out the call
    if (Object.values(collectedArgs).length > 0) {
      output.copyBox(toCliSyntax(args, task), 'Autocompleted');
    }
    // }

    return await runSuper(args, hre, runSuper);
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
