const { types } = require('hardhat/config');
const output = require('common/output');

require('../scopes/util')
  .task('to-bytes', 'Converts strings to bytes32')
  .addOptionalPositionalParam(
    'value',
    'The value to convert. Will always be treated as a string. Cannot be longer than a bytes32 string.',
    undefined,
    types.string
  )
  .setAction(async ({ value }, hre) => {
    try {
      output.result(hre.ethers.encodeBytes32String(value));
    } catch (err) {
      output.problem(err.message);
    }
  });
