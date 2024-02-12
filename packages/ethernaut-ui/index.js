const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const makeTasksInteractive = require('./internal/make-interactive');
const spinner = require('common/spinner');
const output = require('common/output');

requireAll(__dirname, 'scopes');
requireAll(__dirname, 'tasks');

extendEnvironment(async (hre) => {
  makeTasksInteractive(hre);

  await output.init();
  spinner.enable(!hre.hardhatArguments.verbose);

  // TODO: Hack further, or seek support from Nomic
  // bundleLooseTasks(); // This is too hacky, need mods to hardhat
});
