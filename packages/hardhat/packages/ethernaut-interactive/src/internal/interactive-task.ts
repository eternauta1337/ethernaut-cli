import { task } from "hardhat/config";
import {
  HardhatRuntimeEnvironment,
  ScopesMap,
  TaskDefinition,
  TasksMap,
} from "hardhat/types";
// TODO: It seems like enquirer is not exporting these types
// See: https://github.com/enquirer/enquirer/issues/448
// @ts-ignore
import { Input } from "enquirer";

function makeTaskInteractive(
  taskDefinition: TaskDefinition,
  hre: HardhatRuntimeEnvironment
) {
  // Subtasks are not meant to be called from the cli
  if (taskDefinition.isSubtask) {
    return;
  }

  if (
    taskDefinition.name === "help" ||
    taskDefinition.name === "version" ||
    taskDefinition.name === "navigate"
  ) {
    return;
  }

  // Override the action so that we can
  // collect parameters from the user
  const action = async (
    taskArgs: any,
    hre: HardhatRuntimeEnvironment,
    runSuper: any
  ) => {
    const newParams = await collectParameters(taskArgs, taskDefinition);

    Object.entries(newParams).forEach(([name, value]) => {
      taskArgs[name] = value;
    });

    await runSuper(taskArgs, hre, runSuper);
  };

  // Complete the override by calling task
  // at hre or scope level
  if (taskDefinition.scope !== undefined) {
    const scope = hre.scopes[taskDefinition.scope];
    scope.task(taskDefinition.name, taskDefinition.description, action);
  } else {
    task(taskDefinition.name, taskDefinition.description, action);
  }
}

async function collectParameters(
  taskArgs: any,
  taskDefinition: TaskDefinition
) {
  // Put all params in an array
  const positionalParamDefinitions = taskDefinition.positionalParamDefinitions;
  const regularParamDefinitions = Object.values(
    taskDefinition.paramDefinitions
  );
  const paramDefinitions = positionalParamDefinitions.concat(
    regularParamDefinitions
  );

  // Prompt the user for each param
  const newParams: { [name: string]: any } = {};
  for (let paramDefinition of paramDefinitions) {
    // Skip if parameter is passed via CLI
    const receivedParam = taskArgs[paramDefinition.name];
    if (
      receivedParam !== undefined &&
      receivedParam !== paramDefinition.defaultValue
    ) {
      continue;
    }

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

function makeAllTasksInteractive(hre: HardhatRuntimeEnvironment) {
  makeTasksInteractive(hre.tasks, hre);
  makeScopesInteractive(hre.scopes, hre);
}

export { makeAllTasksInteractive };
