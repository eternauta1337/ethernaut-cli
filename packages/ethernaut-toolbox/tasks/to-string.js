const { types } = require('hardhat/config');
const output = require('common/output');
const debug = require('common/debug');

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
      output.resultBox(hre.ethers.toUtf8String(value));
    } catch (err) {
      debug.log(err);
      output.errorBox(err.message);
    }
  });
