const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const spinner = require('common/src/spinner')
const storage = require('./internal/storage')
const preParseAi = require('./internal/pre-parse-ai')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)

  storage.init()

  preParseAi(hre)
})

extendConfig((config, userConfig) => {
  if (!config.ethernaut) config.ethernaut = {}

  config.ethernaut.ai = {
    interpreter: {
      additionalInstructions:
        userConfig.ethernaut?.ai?.interpreter?.additionalInstructions.concat() ||
        [],
    },
    explainer: {
      additionalInstructions:
        userConfig.ethernaut?.ai?.explainer?.additionalInstructions.concat() ||
        [],
    },
  }
})
