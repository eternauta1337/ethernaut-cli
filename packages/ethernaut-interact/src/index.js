const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/require-all');
const copyFiles = require('common/copy-files');
const spinner = require('common/spinner');
const path = require('path');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose);

  copyFiles(
    path.resolve(__dirname, 'abis'),
    path.resolve(process.cwd(), 'artifacts', 'interact', 'abis')
  );
});
