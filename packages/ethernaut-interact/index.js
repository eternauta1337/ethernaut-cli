const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const copyFiles = require('common/copy-files');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  copyFiles('ethernaut-interact/abis', 'ethernaut-cli/artifacts/interact/abis');
});
