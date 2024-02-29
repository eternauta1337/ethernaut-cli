const { extendEnvironment } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const spinner = require('common/src/spinner')
const storage = require('./internal/storage')
const { modifySigners } = require('./internal/signers')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)

  storage.init()

  modifySigners(hre)
})
