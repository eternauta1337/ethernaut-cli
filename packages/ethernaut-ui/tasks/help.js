const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');
const output = require('common/output');

task('help', 'Jumps into the help navigator').setAction(async ({}, hre) => {
  try {
    await navigateFrom(hre.scopes[scope] || hre);
  } catch (err) {
    output.errorBox(err);
  }
});
