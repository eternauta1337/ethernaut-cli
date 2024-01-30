const { task } = require('hardhat/config');
const { AutoComplete } = require('enquirer');
const chalk = require('chalk');

task('navigate', 'Navigates tasks with enquirer')
  .addOptionalPositionalParam('scope', 'The group of tasks to navigate')
  .setAction(async ({ scope }) => {
    let location = hre;

    if (scope) {
      location = hre.scopes[scope];
      if (location === undefined) {
        throw new Error(`Unknown scope: ${scope}`);
      }
    }

    await navigateFrom(location);
  });

async function navigateFrom(location) {
  const nodes = [
    // Merge tasks and scopes
    ...Object.values(location.tasks),
    ...Object.values(location.scopes || {}),
  ];

  const choices = nodes
    .filter((c) => {
      if (c.tasks) return true; // Scope? All scopes are shown
      return !c.isSubtask; // Task? Subtasks are not shown
    })
    .map(
      // Text to display with enquirer
      (c) => {
        return {
          title: `${c.tasks ? `[${c.name}]` : c.name} ${chalk.dim(
            c.description
          )}`,
          value: c.name, // Required for fuzzy search
        };
      }
    );

  const prompt = new AutoComplete({
    message: 'Pick a task or scope',
    limit: 15,
    choices,
    suggest: (input, choices) => {
      // Suggest fn needs to be defined because
      // of a bug in the default implementation
      return choices.filter((choice) => {
        return choice.value.includes(input);
      });
    },
  });

  const response = await prompt.run();
  const nextLocation = nodes.find((n) => response.includes(n.name));

  if (nextLocation.tasks) {
    await navigateFrom(nextLocation);
  } else {
    await hre.run({ task: nextLocation.name, scope: nextLocation.scope });
  }
}
