const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-wallet/src/index')

extendEnvironment((hre) => {
  require('./autocomplete/tasks/activate')(hre)
  require('./autocomplete/tasks/info')(hre)
  require('./autocomplete/tasks/remove')(hre)
})
