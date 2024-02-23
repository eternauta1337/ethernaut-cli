const { types } = require('hardhat/config')
const output = require('common/src/output')
const debug = require('common/src/debug')

require('../scopes/util')
  .task('to-string', 'Converts bytes32 to string')
  .addOptionalPositionalParam(
    'value',
    'The value to convert',
    undefined,
    types.string,
  )
  .setAction(async ({ value }, hre) => {
    try {
      const strNullPadded = hre.ethers.toUtf8String(value)
      const str = strNullPadded.replace(/\x00/g, '')
      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
