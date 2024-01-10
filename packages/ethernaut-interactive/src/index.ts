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
import { Input } from "enquirer";
import { pickTask } from "./internal/task-browser";

extendEnvironment((hre) => {
  hre.previousScope = hre;

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
        await pickTask(hre, hre);
      }
    }
  );
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
