const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-util/src/index')

extendEnvironment((hre) => {
  require('./autocomplete/tasks/unit')(hre)
})
