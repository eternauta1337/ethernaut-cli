const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./autocomplete/alias')
const storage = require('../internal/storage')

const remove = require('../scopes/sig')
  .task('remove', 'Removes a signer from the cli')
  .addOptionalPositionalParam(
    'alias',
    'The alias of the signer to remove',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }) => {
    try {
      const signers = storage.readSigners()

      if (!(alias in signers)) {
        throw new Error(`The signer ${alias} does not exist`)
      }

      delete signers[alias]

      if (signers?.activeSigner === alias) {
        signers.activeSigner = undefined
      }

      storage.storeSigners(signers)

      output.resultBox(`Removed signer ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

remove.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a signer to remove')
