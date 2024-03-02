const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const makeTasksInteractive = require('./internal/make-interactive')
const spinner = require('common/src/spinner')

requireAll(__dirname, 'scopes')
requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  makeTasksInteractive(hre)

  spinner.enable(!hre.hardhatArguments.verbose)

  // TODO: Hack further, or seek support from Nomic
  // bundleLooseTasks(); // This is too hacky, need mods to hardhat
})

extendConfig((config, userConfig) => {
  if (!config.ethernaut) config.ethernaut = {}

  config.ethernaut.ui = {
    exclude: {
      scopes: userConfig.ethernaut?.ui?.exclude?.scopes || [],
      tasks: userConfig.ethernaut?.ui?.exclude?.tasks || [],
    },
  }
})
