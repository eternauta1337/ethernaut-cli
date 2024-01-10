import {
  HardhatRuntimeEnvironment,
  ScopeDefinition,
  TaskDefinition,
} from "hardhat/types";
// TODO: It seems like enquirer is not exporting these types
// See: https://github.com/enquirer/enquirer/issues/448
// @ts-ignore
import { AutoComplete } from "enquirer";
import chalk from "chalk";

async function pickTask(
  hreOrScope: HardhatRuntimeEnvironment | ScopeDefinition,
  hre: HardhatRuntimeEnvironment
) {
  hre.previousScope = hreOrScope;

  const tasksOrScopes = collectTasksAndScopes(hreOrScope);

  // Prepare choice list
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
      // Format task name and description
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

  await enterTaskOrScope(taskOrScope, hre);
}

async function enterTaskOrScope(
  taskOrScope: TaskDefinition | ScopeDefinition,
  hre: HardhatRuntimeEnvironment
) {
  if (isTask(taskOrScope)) {
    const task = taskOrScope as TaskDefinition;

    // Run the task
    await hre.run({ task: task.name, scope: task.scope });

    // Will return to the previous scope
    // after running the task
    if (task.scope) {
      hre.previousScope = hre.scopes[task.scope];
    } else {
      hre.previousScope = hre;
    }

    // Pick task from the previous scope
    if (hre.previousScope) {
      await pickTask(hre.previousScope, hre);
    }
  } else {
    const scope = taskOrScope as ScopeDefinition;
    hre.previousScope = scope;

    await pickTask(scope, hre);
  }
}

function collectTasksAndScopes(
  hreOrScope: HardhatRuntimeEnvironment | ScopeDefinition
) {
  let tasksAndScopes: (TaskDefinition | ScopeDefinition)[] = [];

  // Both have tasks
  for (let taskName in hreOrScope.tasks) {
    const taskDefinition = hreOrScope.tasks[taskName];
    tasksAndScopes.push(taskDefinition);
  }

  // Only hre has scopes
  if (isHre(hreOrScope)) {
    const hre = hreOrScope as HardhatRuntimeEnvironment;
    for (let scopeName in hre.scopes) {
      const scopeDefinition = hre.scopes[scopeName];
      tasksAndScopes.push(scopeDefinition);
    }
  }

  return tasksAndScopes;
}

function isTask(taskOrScope: TaskDefinition | ScopeDefinition): boolean {
  return "isSubtask" in taskOrScope;
}

function isHre(hreOrScope: HardhatRuntimeEnvironment | ScopeDefinition) {
  return "scopes" in hreOrScope;
}

export { pickTask };
