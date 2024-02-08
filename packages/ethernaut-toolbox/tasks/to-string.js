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
    try {
      output.result(hre.ethers.toUtf8String(value));
    } catch (err) {
      output.problem(err.message);
    }
  });
