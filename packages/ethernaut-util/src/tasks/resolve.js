const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')

require('../scopes/util')
  .task('resolve', 'Resolves an ens name to an address')
  .addPositionalParam('ens', 'The ens name to resolve', undefined, types.ens)
  .setAction(async ({ ens }, hre) => {
    try {
      const address = await hre.ethers.provider.resolveName(ens)

      if (!address) {
        throw new Error('Unable to resolve ens name')
      }

      return output.resultBox(address)
    } catch (err) {
      return output.errorBox(err)
    }
  })
