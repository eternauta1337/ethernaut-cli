import { extendEnvironment, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { pickTask } from "./internal/task-browser";
import {
  makeTasksInteractive,
  makeScopesInteractive,
} from "./internal/interactive-task";

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
