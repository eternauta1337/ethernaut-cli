const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-network/src/index')

extendEnvironment((hre) => {
  require('./prompts/tasks/activate')(hre)
  require('./prompts/tasks/add')(hre)
  require('./prompts/tasks/edit')(hre)
  require('./prompts/tasks/info')(hre)
  require('./prompts/tasks/node')(hre)
  require('./prompts/tasks/remove')(hre)
})
