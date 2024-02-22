const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/src/require-all');
const spinner = require('common/src/spinner');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose);
});
