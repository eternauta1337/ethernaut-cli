const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')

require('../scopes/util')
  .task('hex', 'Converts integers to hex')
  .addPositionalParam('value', 'The value to convert.', undefined, types.int)
  .setAction(async ({ value }, hre) => {
    try {
      return output.resultBox(hre.ethers.toQuantity(value))
    } catch (err) {
      return output.errorBox(err)
    }
  })
