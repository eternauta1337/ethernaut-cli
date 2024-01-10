import { extendEnvironment } from "hardhat/config";
import { makeAllTasksInteractive } from "./internal/interactive-task";

import "./tasks/navigate";

extendEnvironment((hre) => {
  makeAllTasksInteractive(hre);
});
