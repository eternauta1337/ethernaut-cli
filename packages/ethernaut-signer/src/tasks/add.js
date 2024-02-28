const { types } = require('hardhat/config')
const output = require('common/src/output')
// const autocompleteUrl = require('./autocomplete/url')
const storage = require('../internal/storage')
const { validateVarName } = require('common/src/name')

require('../scopes/sig')
  .task('add', 'Adds a signer to the cli')
  .addOptionalPositionalParam(
    'alias',
    'How the signer will be referenced',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'pk',
    'The private key of the signer',
    undefined,
    types.string,
  )
  .setAction(async ({ alias, pk }) => {
    try {
      if (!validateVarName(alias)) {
        throw new Error(
          `Invalid alias: ${alias}. The alias must be a valid JavaScript variable name.`,
        )
      }

      const signers = storage.readSigners()

      if (alias in signers) {
        throw new Error(`The signer ${alias} already exists`)
      }

      signers[alias] = {
        pk,
      }

      storage.storeSigners(signers)

      output.resultBox(`Added signer ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

// add.paramDefinitions.url.autocomplete = autocompleteUrl
