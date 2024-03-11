const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')

require('../scopes/util')
  .task('checksum', 'Computes or validates the checksum of an address')
  .addPositionalParam(
    'address',
    'The address whose checksum will be computed. If the address contains mixed case characters, its checksum will be validated.',
    undefined,
    types.string,
  )
  .setAction(async ({ address }, hre) => {
    try {
      return output.resultBox(hre.ethers.getAddress(address))
    } catch (err) {
      return output.errorBox(err)
    }
  })
