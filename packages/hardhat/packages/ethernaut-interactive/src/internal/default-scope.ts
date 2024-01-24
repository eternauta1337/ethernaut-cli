import { HardhatRuntimeEnvironment } from "hardhat/types";
import { hh } from "../scopes/hh";

function bundleHardhatTasksInScope(hre: HardhatRuntimeEnvironment) {
  for (let taskName in hre.tasks) {
    const taskDefinition = hre.tasks[taskName];
    // console.log(taskDefinition);

    if (taskDefinition.isSubtask) continue;

    // TODO: Prop is read only
    // taskDefinition.scope = "hh";
    hh.task(
      taskDefinition.name,
      taskDefinition.description,
      taskDefinition.action
    );
  }

  // hre.tasks = [];
}

export { bundleHardhatTasksInScope };
