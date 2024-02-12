const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const spinner = require('common/spinner');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose);
});
