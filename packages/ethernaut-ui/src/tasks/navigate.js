const { task } = require('hardhat/config')
const navigateFrom = require('../internal/navigate-from')
const output = require('common/src/output')

task('navigate', 'Navigates tasks with enquirer')
  .addOptionalPositionalParam(
    'scope',
    'The group of tasks to navigate. Defaults to the root scope',
  )
  .setAction(async ({ scope }) => {
    try {
      await navigateFrom(hre.scopes[scope] || hre, hre)
    } catch (err) {
      output.errorBox(err)
    }
  })
