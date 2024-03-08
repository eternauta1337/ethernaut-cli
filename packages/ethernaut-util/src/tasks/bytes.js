const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')

require('../scopes/util')
  .task('bytes', 'Converts strings to bytes32')
  .addPositionalParam(
    'value',
    'The value to convert. Will always be treated as a string. Cannot be longer than a bytes32 string.',
    undefined,
    types.string,
  )
  .setAction(async ({ value }, hre) => {
    try {
      return output.resultBox(hre.ethers.encodeBytes32String(value))
    } catch (err) {
      return output.errorBox(err)
    }
  })
