const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-network/src/index')

extendEnvironment((hre) => {
  require('./autocomplete/tasks/activate')(hre)
  require('./autocomplete/tasks/add')(hre)
  require('./autocomplete/tasks/edit')(hre)
  require('./autocomplete/tasks/info')(hre)
  require('./autocomplete/tasks/node')(hre)
  require('./autocomplete/tasks/remove')(hre)
})
