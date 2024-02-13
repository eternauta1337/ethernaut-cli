const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');
const output = require('common/output');

task('help', 'Jumps into the help navigator').setAction(async ({}, hre) => {
  try {
    if (process.argv.length >= 3) {
      const scope = process.argv[2];
      await navigateFrom(hre.scopes[scope] || hre);
    }
  } catch (err) {
    output.errorBox(err);
  }
});
