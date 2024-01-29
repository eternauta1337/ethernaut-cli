const { types } = require('hardhat/config');
const tools = require('../scopes/tools');

tools
  .task('to-string', 'Converts bytes32 to string')
  .addPositionalParam('value', 'The value to convert', undefined, types.string)
  .setAction(async ({ value }, hre) => {
    const result = hre.ethers.toUtf8String(value);

    console.log(result);
  });
