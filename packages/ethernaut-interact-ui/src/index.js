const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-interact/src/index')

extendEnvironment((hre) => {
  require('./prompts/tasks/contract')(hre)
})
