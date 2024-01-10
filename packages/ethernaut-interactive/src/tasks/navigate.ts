import { task } from "hardhat/config";
import { pickTask } from "../internal/task-navigator";

task(
  "navigate",
  "Interactively navigate all hh tasks with autocompletion"
).setAction(async (taskArgs, hre, runSuper) => {
  await pickTask(hre, hre);
});
