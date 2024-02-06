const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');

task('help', 'Jumps into the help navigator').setAction(async ({}, hre) => {
  let node = hre;

  if (process.argv.length >= 3) {
    const scope = process.argv[2];
    node = hre.scopes[scope];
    if (node === undefined) {
      throw new Error(`Unknown scope: ${scope}`);
    }
  }

  await navigateFrom(node);
});
