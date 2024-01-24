import { extendEnvironment } from "hardhat/config";
import { makeAllTasksInteractive } from "./internal/interactive-task";
import { bundleHardhatTasksInScope } from "./internal/default-scope";

// Navigation entry point
import "./tasks/navigate";

extendEnvironment((hre) => {
  // An interactive task queries for parameters,
  // and allows to be ran without required parameters
  // makeAllTasksInteractive(hre);

  bundleHardhatTasksInScope(hre);
});
