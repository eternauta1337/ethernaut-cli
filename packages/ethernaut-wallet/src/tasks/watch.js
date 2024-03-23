const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/wallet')
  .task('watch', 'Adds a wallet with no private key')
  .addPositionalParam(
    'alias',
    'The name of the wallet',
    undefined,
    types.string,
  )
  .addParam(
    'address',
    'The address of the wallet to add',
    undefined,
    types.address,
  )
  .setAction(async ({ alias, address }) => {
    try {
      const signers = storage.readSigners()

      if (alias in signers) {
        throw new EthernautCliError(
          'ethernaut-wallet',
          `The wallet ${alias} already exists`,
          false,
        )
      }

      signers[alias] = {
        address,
      }

      storage.storeSigners(signers)

      return output.resultBox(
        `Added wallet ${alias} with address ${address} (read only)`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
