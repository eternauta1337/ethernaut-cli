const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const { setSigner } = require('../internal/signers')

require('../scopes/wallet')
  .task('activate', 'Activates a wallet')
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
        throw new Error(`The wallet ${alias} does not exist`)
      }

      await setSigner(alias)

      signers.activeSigner = alias
      storage.storeSigners(signers)

      const signer = signers[alias]

      return output.resultBox(
        `The current wallet is now "${alias}" with address ${signer.address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
