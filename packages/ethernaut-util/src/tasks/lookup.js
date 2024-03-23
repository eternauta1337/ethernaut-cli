const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

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
        throw new EthernautCliError(
          'ethernaut-network',
          'No ens name found for address. Is the primary name configured for this ens?',
          false,
        )
      }

      return output.resultBox(name)
    } catch (err) {
      return output.errorBox(err)
    }
  })
