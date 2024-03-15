const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')

require('../scopes/util')
  .task('resolve', 'Resolves an ens name to an address')
  .addPositionalParam(
    'name',
    'The ens name to resolve',
    undefined,
    types.string,
  )
  .setAction(async ({ name }, hre) => {
    try {
      return output.resultBox(await hre.ethers.provider.resolveName(name))
    } catch (err) {
      return output.errorBox(err)
    }
  })
