const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-ai/src/index')

extendEnvironment((hre) => {
  const config = hre.scopes.ai.tasks.model
  config.paramDefinitions.model.prompt = require('./prompts/model')
})
