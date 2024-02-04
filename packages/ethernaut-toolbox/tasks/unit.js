const { types } = require('hardhat/config');
const util = require('../scopes/util');

util
  .task(
    'unit',
    'Converts between different units of Ether. E.g. 1 ether is 1000000000000000000 wei. Units can be wei, ether, kwei, mwei, gwei, szabo, finney, etc'
  )
  .addPositionalParam('value', 'The value to convert', undefined, types.string)
  .addOptionalParam('from', 'The unit to convert from', 'ether', types.string)
  .addOptionalParam('to', 'The unit to convert to', 'wei', types.string)
  .setAction(async ({ value, from, to }, hre) => {
    const valueWei = ethers.parseUnits(value, from);
    let result = ethers.formatUnits(valueWei, to);

    const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/;
    result = result.match(removeTrailingZeroes)[1];

    console.log(result);
  });
