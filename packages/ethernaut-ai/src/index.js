const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const spinner = require('common/src/spinner')
const storage = require('./internal/storage')
const hardhatParser = require('./internal/hardhat-parser')

requireAll(__dirname, 'tasks')

hardhatParser.modifyArgumentsParser()

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)

  storage.init()

  hardhatParser.preParse(hre)
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
