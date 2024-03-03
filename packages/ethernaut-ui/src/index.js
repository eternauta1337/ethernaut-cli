const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const makeTasksInteractive = require('./internal/make-interactive')
const spinner = require('common/src/spinner')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  makeTasksInteractive(hre)

  spinner.enable(!hre.hardhatArguments.verbose)
})

extendConfig((config, userConfig) => {
  if (!config.ethernaut) config.ethernaut = {}

  config.ethernaut.ui = {
    exclude: {
      scopes: userConfig.ethernaut?.ui?.exclude?.scopes.concat() || [],
      tasks: userConfig.ethernaut?.ui?.exclude?.tasks.concat() || [],
    },
  }
})
