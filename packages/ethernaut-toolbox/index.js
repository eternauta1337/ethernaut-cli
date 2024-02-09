const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {});
