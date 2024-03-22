const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')

require('../scopes/util')
  .task('string', 'Converts bytes to string')
  .addPositionalParam(
    'value',
    'The bytes value to convert',
    undefined,
    types.bytes,
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
