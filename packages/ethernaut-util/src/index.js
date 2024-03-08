const { extendEnvironment } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/require-all')
const spinner = require('ethernaut-common/src/spinner')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)
})
