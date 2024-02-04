const { types } = require('hardhat/config');
const tools = require('../scopes/tools');

tools
  .task('to-bytes', 'Converts strings to bytes32')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'value',
    'The value to convert. Must be a bytes32 string',
    undefined,
    types.string
  )
  .setAction(async ({ value }, hre) => {
    const result = hre.ethers.encodeBytes32String(value);

    console.log(result);
  });
