const { extendEnvironment } = require('hardhat/config')
const autocompleteUnit = require('./autocomplete/unit')

require('ethernaut-ui/src/index')
require('ethernaut-util/src/index')

extendEnvironment((hre) => {
  autocompleteUnit(hre)
})
