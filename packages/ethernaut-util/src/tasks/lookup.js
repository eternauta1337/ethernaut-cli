const addressType = require('ethernaut-common/src/type-address')
const output = require('ethernaut-common/src/output')

require('../scopes/util')
  .task('lookup', 'Lookup the address of an ens name')
  .addPositionalParam(
    'address',
    'The address to lookup',
    undefined,
    addressType,
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
