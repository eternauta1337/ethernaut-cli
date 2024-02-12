const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const copyFiles = require('common/copy-files');
const spinner = require('common/spinner');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose);

  copyFiles('ethernaut-interact/abis', 'ethernaut-cli/artifacts/interact/abis');
});
