const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./autocomplete/alias')
const storage = require('../internal/storage')
const { setSigner } = require('../internal/signers')

const set = require('../scopes/sig')
  .task('set', 'Activates a signer on the cli')
  .addOptionalPositionalParam(
    'alias',
    'The alias of the signer to activate',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }) => {
    try {
      const signers = storage.readSigners()

      if (!(alias in signers)) {
        throw new Error(`The signer ${alias} does not exist`)
      }

      await setSigner(alias)

      signers.activeSigner = alias
      storage.storeSigners(signers)

      const signer = signers[alias]

      output.resultBox(
        `The active signer is now "${alias}" with address ${signer.address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })

set.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a signer to activate')
