const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');
const output = require('common/output');

task('navigate', 'Navigates tasks with enquirer')
  .addOptionalPositionalParam('scope', 'The group of tasks to navigate')
  .setAction(async ({ scope }) => {
    try {
      await navigateFrom(hre.scopes[scope] || hre);
    } catch (err) {
      output.errorBox(err.message);
    }
  });
