const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/io/require-all')
const makeTasksInteractive = require('./internal/make-interactive')
const spinner = require('ethernaut-common/src/ui/spinner')
const preParseUi = require('./internal/pre-parse-ui')
const output = require('ethernaut-common/src/ui/output')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  makeTasksInteractive(hre)

  spinner.enable(!hre.hardhatArguments.verbose)
  output.setErrorVerbose(hre.hardhatArguments.verbose)

  preParseUi(hre)
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
