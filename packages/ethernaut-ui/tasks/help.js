const { task } = require('hardhat/config');
const navigateFrom = require('../internal/navigate-from');

task('help', 'Jumps into the help navigator').setAction(async ({}, hre) => {
  await navigateFrom(hre);
});
