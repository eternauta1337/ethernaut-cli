const { types } = require('hardhat/config');
const oz = require('../scopes/oz');

oz.task('info', 'Shows information about an OZ challenge level')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'level',
    'The level name or number',
    undefined,
    types.string
  )
  .setAction(async ({ level }, hre) => {
    console.log('Level:', level);
  });
