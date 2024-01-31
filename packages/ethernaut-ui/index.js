const { task: hreTask, extendEnvironment } = require('hardhat/config');
const { Input } = require('enquirer');
const getNodes = require('./internal/get-nodes');
const requireAll = require('utilities/require-all');
const hh = require('./scopes/hh');

requireAll(__dirname, 'scopes');
requireAll(__dirname, 'tasks');

let _hre;

extendEnvironment((hre) => {
  _hre = hre;

  makeTasksInteractive(hre);

  // TODO: Hack further, or seek support from Nomic
  // bundleLooseTasks(); // This is too hacky, need mods to hardhat
});

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
      newArgs[param.name] = await param.prompt({ ...args, ...newArgs });
      continue;
    }

    const prompt = new Input({
      message: `Enter ${param.name}`,
      initial: param.defaultValue,
    });

    const response = await prompt.run().catch(() => process.exit(0));

    newArgs[param.name] = response;
  }

  return newArgs;
}

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

function bundleLooseTasks() {
  Object.values(_hre.tasks).forEach((task) => {
    if (task.isSubtask) return;
    if (task.scope) return;
    if (task.name === 'navigate') return;
    if (task.name === 'help') return;

    task.scope = 'hh';
    _hre.tasks[task.name] = {};

    hh.task(task.name, task.description, task.action);
  });
}
