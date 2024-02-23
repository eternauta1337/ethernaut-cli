const { extendEnvironment } = require('hardhat/config')
const requireAll = require('common/src/require-all')
const makeTasksInteractive = require('./internal/make-interactive')
const spinner = require('common/src/spinner')

requireAll(__dirname, 'scopes')
requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  makeTasksInteractive(hre)

  spinner.enable(!hre.hardhatArguments.verbose)

  // TODO: Hack further, or seek support from Nomic
  // bundleLooseTasks(); // This is too hacky, need mods to hardhat
})
