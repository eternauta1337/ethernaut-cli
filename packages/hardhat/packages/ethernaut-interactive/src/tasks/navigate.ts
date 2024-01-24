import { task, types } from "hardhat/config";
import { pickTask } from "../internal/task-navigator";

task("navigate", "Interactively navigate all hh tasks with autocompletion")
  .addPositionalParam(
    "scope",
    "The scope to show tasks for",
    "hre",
    types.string,
    true
  )
  .setAction(async (taskArgs, hre, runSuper) => {
    const { scope } = taskArgs;

    if (scope === "hre") {
      await pickTask(hre, hre);
    } else {
      if (!hre.scopes[scope]) {
        throw new Error(`Scope ${scope} not found`);
      }

      const scopeDefinition = hre.scopes[scope];
      await pickTask(scopeDefinition, hre);
    }
  });
