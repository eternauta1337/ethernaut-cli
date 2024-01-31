const { task } = require('hardhat/config');
const { AutoComplete } = require('enquirer');
const getNodes = require('../internal/get-nodes');
const chalk = require('chalk');
const suggest = require('common/enquirer-suggest');

task('navigate', 'Navigates tasks with enquirer')
  .addOptionalPositionalParam('scope', 'The group of tasks to navigate')
  .setAction(async ({ scope }) => {
    let node = hre;

    if (scope) {
      node = hre.scopes[scope];
      if (node === undefined) {
        throw new Error(`Unknown scope: ${scope}`);
      }
    }

    await navigateFrom(node);
  });

async function navigateFrom(node) {
  const children = getNodes(node);

  const choices = children.map((node) => ({
    title: `${node.tasks ? `[${node.name}]` : node.name} ${chalk.dim(
      node.description
    )}`,
    value: node.name, // Autocomplete search hits this
  }));

  // If on scope, show an option
  // to go to the root scope
  const upTitle = '↩ up';
  if (node.isScope && node !== hre) {
    choices.unshift({ title: upTitle, value: undefined });
  }

  const prompt = new AutoComplete({
    message: 'Pick a task or scope',
    limit: 15,
    choices,
    suggest,
  });

  const response = await prompt.run().catch(() => process.exit(0));

  if (response === upTitle) {
    await navigateFrom(hre);
  }

  const nextLocation = children.find((node) => response.includes(node.name));

  if (nextLocation.isScope) {
    await navigateFrom(nextLocation);
  } else {
    await hre.run({ task: nextLocation.name, scope: nextLocation.scope });

    // When running a task from navigation
    // return to navigation after the task is done
    await navigateFrom(node);
  }
}
