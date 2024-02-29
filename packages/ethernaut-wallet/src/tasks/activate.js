const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./autocomplete/alias')
const storage = require('../internal/storage')
const { setSigner } = require('../internal/signers')

const set = require('../scopes/wallet')
  .task('activate', 'Activates a wallet')
  .addOptionalPositionalParam(
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

      output.resultBox(
        `The current wallet is now "${alias}" with address ${signer.address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })

set.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a wallet to activate')
