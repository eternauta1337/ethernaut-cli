const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/wallet')
  .task('remove', 'Removes a wallet')
  .addPositionalParam(
    'alias',
    'The name of the wallet',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }) => {
    try {
      const signers = storage.readSigners()

      if (!(alias in signers)) {
        throw new EthernautCliError(
          'ethernaut-wallet',
          `The wallet ${alias} does not exist`,
        )
      }

      delete signers[alias]

      if (signers?.activeSigner === alias) {
        signers.activeSigner = undefined
      }

      storage.storeSigners(signers)

      return output.resultBox(`Removed signer ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
