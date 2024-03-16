const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')

require('../scopes/util')
  .task('lookup', 'Lookup the address of an ens name')
  .addPositionalParam(
    'address',
    'The address to lookup',
    undefined,
    types.address,
  )
  .setAction(async ({ address }, hre) => {
    try {
      const name = await hre.ethers.provider.lookupAddress(address)

      if (name === null) {
        throw new Error(
          'No ens name found for address. Is the primary name configured for this ens?',
        )
      }

      return output.resultBox(name)
    } catch (err) {
      return output.errorBox(err)
    }
  })
