const { task: hreTask } = require('hardhat/config');
const { Input } = require('enquirer');
const getNodes = require('common/get-nodes');
const debug = require('common/debugger');

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

  // Override the action so that we can
  // collect parameters from the user before runnint it
  const action = async (args, hre, runSuper) => {
    const newArgs = await collectParameters(args, task);
    args = { ...args, ...newArgs };
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
    // Skip if arg is already provided
    const arg = args[param.name];
    if (arg !== undefined) continue;

    // Does the parameter provide its own prompt?
    if (param.prompt) {
      debug.log(`Running custom prompt for "${param.name}"`);

      newArgs[param.name] = await param.prompt({
        hre: _hre,
        name: param.name,
        description: param.description,
        ...args,
        ...newArgs,
      });

      debug.log(
        `Custom prompt for "${param.name}" collected "${newArgs[param.name]}"`
      );

      if (newArgs[param.name] !== undefined) continue;
    }

    const description = param.description
      ? ` (${param.description.split('.')[0].substring(0, 150)})`
      : '';
    const prompt = new Input({
      message: `Enter ${param.name}${description}:`,
      initial: param.defaultValue,
    });

    const response = await prompt.run().catch(() => process.exit(0));

    newArgs[param.name] = response;
  }

  return newArgs;
}
