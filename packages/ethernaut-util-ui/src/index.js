const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-util/src/index')

extendEnvironment((hre) => {
  require('./prompts/tasks/unit')(hre)
})
