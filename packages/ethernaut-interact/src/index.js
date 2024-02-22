const { extendEnvironment } = require('hardhat/config');
const requireAll = require('common/src/require-all');
const copyFiles = require('common/src/copy-files');
const spinner = require('common/src/spinner');
const path = require('path');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose);

  copyFiles(
    path.resolve(__dirname, 'abis'),
    path.resolve(process.cwd(), 'artifacts', 'interact', 'abis')
  );
});
