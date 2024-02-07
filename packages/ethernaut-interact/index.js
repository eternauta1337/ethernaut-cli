const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const logger = require('common/logger');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  logger.setVerbose(hre.hardhatArguments.verbose);
});
