const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-ai/src/index')

extendEnvironment((hre) => {
  const config = hre.scopes.ai.tasks.config
  config.paramDefinitions.model.prompt = require('./prompts/model')
})
