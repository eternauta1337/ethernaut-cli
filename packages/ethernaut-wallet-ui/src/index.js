const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-wallet/src/index')

extendEnvironment((hre) => {
  require('./prompts/tasks/activate')(hre)
  require('./prompts/tasks/info')(hre)
  require('./prompts/tasks/remove')(hre)
})
