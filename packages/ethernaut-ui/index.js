const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const makeTasksInteractive = require('./internal/make-interactive');
const logger = require('common/logger');

requireAll(__dirname, 'scopes');
requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  logger.setVerbose(hre.hardhatArguments.verbose);

  makeTasksInteractive(hre);

  // TODO: Hack further, or seek support from Nomic
  // bundleLooseTasks(); // This is too hacky, need mods to hardhat
});
