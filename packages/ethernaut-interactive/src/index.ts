import { extendEnvironment, task } from "hardhat/config";
import {
  HardhatRuntimeEnvironment,
  ScopeDefinition,
  ScopesMap,
  TaskDefinition,
  TasksMap,
} from "hardhat/types";
// TODO: It seems like enquirer is not exporting these types
// See: https://github.com/enquirer/enquirer/issues/448
// @ts-ignore
import { AutoComplete, Input } from "enquirer";
import chalk from "chalk";

let previousScope: HardhatRuntimeEnvironment | ScopeDefinition;

extendEnvironment((hre) => {
  // console.log('Extending environment...');

  makeTasksInteractive(hre.tasks, hre);
  makeScopesInteractive(hre.scopes, hre);

  overrideHelpTask(hre);
});

function overrideHelpTask(hre: HardhatRuntimeEnvironment) {
  const helpTask = hre.tasks.help;

  task(helpTask.name, helpTask.description).setAction(
    async (taskArgs, hre, runSuper) => {
      if (process.argv.length >= 3) {
        runSuper(taskArgs);
      } else {
        previousScope = hre;
        await pickTaskOrScope(collectTasksAndScopes(hre), hre);
      }
    }
  );
}

async function pickTaskOrScope(
  tasksOrScopes: (TaskDefinition | ScopeDefinition)[],
  hre: HardhatRuntimeEnvironment
) {
  const choices = tasksOrScopes
    .filter((item) => {
      // Do not include subtasks
      if (isTask(item)) {
        return !(item as TaskDefinition).isSubtask;
      } else {
        return true;
      }
    })
    .map((item) => {
      const name = `${item.name}`;
      const description = chalk.dim(`${item.description}`);
      if (isTask(item)) {
        return `${name} ${description}`;
      } else {
        return `[${name}] ${description}`;
      }
    });

  const prompt = new AutoComplete({
    name: "value",
    message: "Pick a task or scope",
    limit: 10,
    choices,
  });

  const response: { value: string } = await prompt.run();

  const taskOrScope = tasksOrScopes.find((taskOrScope) => {
    return response.toString().includes(taskOrScope.name);
  })!;

  if (isTask(taskOrScope)) {
    const task = taskOrScope as TaskDefinition;
    await hre.run({ task: task.name, scope: task.scope });

    if (task.scope) {
      previousScope = hre.scopes[task.scope];
    }

    // console.log(previousScope);
    if (previousScope) {
      await pickTaskOrScope(Object.values(previousScope.tasks), hre);
    }
  } else {
    const scope = taskOrScope as ScopeDefinition;
    previousScope = scope;
    await pickTaskOrScope(Object.values(scope.tasks), hre);
  }
}

function isTask(taskOrScope: TaskDefinition | ScopeDefinition): boolean {
  return "isSubtask" in taskOrScope;
}

function collectTasksAndScopes(hre: HardhatRuntimeEnvironment) {
  let tasksAndScopes: (TaskDefinition | ScopeDefinition)[] = [];

  for (let taskName in hre.tasks) {
    const taskDefinition = hre.tasks[taskName];
    tasksAndScopes.push(taskDefinition);
  }

  for (let scopeName in hre.scopes) {
    const scopeDefinition = hre.scopes[scopeName];
    tasksAndScopes.push(scopeDefinition);
  }

  return tasksAndScopes;
}

function makeTaskInteractive(
  taskDefinition: TaskDefinition,
  hre: HardhatRuntimeEnvironment
) {
  if (taskDefinition.isSubtask) {
    return;
  }

  // Define the overriding action
  const action = async (
    taskArgs: any,
    hre: HardhatRuntimeEnvironment,
    runSuper: any
  ) => {
    // console.log('Overriding task:', taskDefinition.name);
    // console.log('Original taskArgs:', taskArgs);
    // console.log(taskDefinition);

    const newParams = await collectParameters(taskDefinition);
    // console.log('New params:', newParams);

    Object.entries(newParams).forEach(([name, value]) => {
      taskArgs[name] = value;
    });
    // console.log('New taskArgs:', taskArgs);

    await runSuper(taskArgs, hre, runSuper);
  };

  // Finalize the override by calling the task in scope
  if (taskDefinition.scope !== undefined) {
    const scope = hre.scopes[taskDefinition.scope];
    scope.task(taskDefinition.name, taskDefinition.description, action);
  } else {
    task(taskDefinition.name, taskDefinition.description, action);
  }
}

async function collectParameters(taskDefinition: TaskDefinition) {
  const positionalParamDefinitions = taskDefinition.positionalParamDefinitions;
  const regularParamDefinitions = Object.values(
    taskDefinition.paramDefinitions
  );
  const paramDefinitions = positionalParamDefinitions.concat(
    regularParamDefinitions
  );

  const newParams: { [name: string]: any } = {};

  for (let paramDefinition of paramDefinitions) {
    // console.log(paramDefinition);

    const prompt = new Input({
      message: `Enter ${paramDefinition.name}`,
      initial: paramDefinition.defaultValue,
    });

    const response = await prompt.run();

    // TODO: Parse and validate using paramDefinition.type
    // let value = response;
    // if (paramDefinition.type) {
    //   value = paramDefinition.type.parse(value);
    // }

    newParams[paramDefinition.name] = response;
  }

  return newParams;
}

function makeTasksInteractive(tasks: TasksMap, hre: HardhatRuntimeEnvironment) {
  for (let taskName in tasks) {
    const taskDefinition = tasks[taskName];
    makeTaskInteractive(taskDefinition, hre);
  }
}

function makeScopesInteractive(
  scopes: ScopesMap,
  hre: HardhatRuntimeEnvironment
) {
  for (let scopeName in scopes) {
    const scopeDefinition = scopes[scopeName];
    makeTasksInteractive(scopeDefinition.tasks, hre);
  }
}
