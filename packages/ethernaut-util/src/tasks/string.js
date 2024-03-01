const { types } = require('hardhat/config')
const output = require('common/src/output')

require('../scopes/util')
  .task('string', 'Converts bytes32 to string')
  .addPositionalParam('value', 'The value to convert', undefined, types.string)
  .setAction(async ({ value }, hre) => {
    try {
      const strNullPadded = hre.ethers.toUtf8String(value)
      // eslint-disable-next-line no-control-regex
      const str = strNullPadded.replace(/\x00/g, '')
      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
