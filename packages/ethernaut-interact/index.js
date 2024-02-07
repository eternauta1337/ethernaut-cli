const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const logger = require('common/logger');
const spinner = require('common/spinner');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  logger.setVerbose(hre.hardhatArguments.verbose);
  spinner.enable(!hre.hardhatArguments.verbose);
});
