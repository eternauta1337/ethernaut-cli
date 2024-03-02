const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-network/src/index')

extendEnvironment((hre) => {
  require('./autocomplete/activate')(hre)
  require('./autocomplete/add')(hre)
  // require('./autocomplete/edit')(hre)
  // require('./autocomplete/info')(hre)
  // require('./autocomplete/node')(hre)
  // require('./autocomplete/remove')(hre)
})
