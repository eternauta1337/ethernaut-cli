const types = require('ethernaut-common/src/validation/types')
const { task } = require('hardhat/config')
const navigateFrom = require('../internal/navigate-from')
const output = require('ethernaut-common/src/ui/output')

task('navigate', 'Navigates tasks and scopes with enquirer')
  .addOptionalPositionalParam(
    'scope',
    'The group of tasks to navigate. Defaults to the root scope',
    undefined,
    types.string,
  )
  .setAction(async ({ scope }) => {
    try {
      await navigateFrom(hre.scopes[scope] || hre, hre)
    } catch (err) {
      output.errorBox(err)
    }
  })
