const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/require-all')
const spinner = require('ethernaut-common/src/spinner')
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
    model: userConfig.ethernaut?.ai?.model || 'gpt-4-1106-preview',
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
