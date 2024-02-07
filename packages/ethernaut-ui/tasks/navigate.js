const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');
const output = require('common/output');

task('navigate', 'Navigates tasks with enquirer')
  .addOptionalPositionalParam('scope', 'The group of tasks to navigate')
  .setAction(async ({ scope }) => {
    let node = hre;

    if (scope) {
      node = hre.scopes[scope];
      if (node === undefined) {
        debug.error(new Error(`Unknown scope: ${scope}`));
      }
    }

    await navigateFrom(node);
  });
