const { extendEnvironment } = require('hardhat/config')
const promptUnit = require('./prompts/unit')

require('ethernaut-ui/src/index')
require('ethernaut-util/src/index')

extendEnvironment((hre) => {
  const unit = hre.scopes.util.tasks.unit
  unit.paramDefinitions['from'].prompt = promptUnit
  unit.paramDefinitions['to'].prompt = promptUnit
})
