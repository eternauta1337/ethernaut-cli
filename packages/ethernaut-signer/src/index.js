const { extendEnvironment } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const spinner = require('common/src/spinner')
// const storage = require('./internal/storage')
// const { setActiveNetwork } = require('./internal/set-network')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)

  // storage.init()

  // setActiveNetwork(hre)
})
