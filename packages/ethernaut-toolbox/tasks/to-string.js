const { types } = require('hardhat/config');
const output = require('common/output');

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
      debug.error(err);
    }

    output.result(result);
  });
