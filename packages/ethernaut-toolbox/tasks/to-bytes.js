const { types } = require('hardhat/config');

require('../scopes/util')
  .task('to-bytes', 'Converts strings to bytes32')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'value',
    'The value to convert. Will always be treated as a string. Cannot be longer than a bytes32 string.',
    undefined,
    types.string
  )
  .setAction(async ({ value }, hre) => {
    const result = hre.ethers.encodeBytes32String(value);

    console.log(result);
  });
