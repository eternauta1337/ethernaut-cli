const { types } = require('hardhat/config');

require('../scopes/util')
  .task('to-string', 'Converts bytes32 to string')
  .addOptionalPositionalParam(
    'value',
    'The value to convert',
    undefined,
    types.string
  )
  .setAction(async ({ value }, hre) => {
    let result;

    try {
      result = hre.ethers.toUtf8String(value);
    } catch (err) {
      console.log(err.message.split('(')[0]);
    }
    if (result === undefined) return;

    console.log(result);
  });
