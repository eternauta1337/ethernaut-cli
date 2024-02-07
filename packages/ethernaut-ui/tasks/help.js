const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');
const output = require('common/output');

task('help', 'Jumps into the help navigator').setAction(async ({}, hre) => {
  let node = hre;

  if (process.argv.length >= 3) {
    const scope = process.argv[2];
    node = hre.scopes[scope];
    if (node === undefined) {
      debug.error(new Error(`Unknown scope: ${scope}`));
    }
  }

  await navigateFrom(node);
});
