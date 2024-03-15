const types = require('ethernaut-common/src/types')
const output = require('ethernaut-common/src/output')

require('../scopes/util')
  .task('string', 'Converts bytes32 to string')
  .addPositionalParam(
    'value',
    'The bytes32 value to convert',
    undefined,
    types.bytes32,
  )
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
