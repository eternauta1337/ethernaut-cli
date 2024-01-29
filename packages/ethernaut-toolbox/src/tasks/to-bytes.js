const { types } = require('hardhat/config');
const tools = require('../scopes/tools');

tools
  .task('to-bytes', 'Converts strings to bytes32')
  .addPositionalParam('value', 'The value to convert', undefined, types.string)
  .setAction(async ({ value }, hre) => {
    const result = hre.ethers.encodeBytes32String(value);

    console.log(result);
  });
