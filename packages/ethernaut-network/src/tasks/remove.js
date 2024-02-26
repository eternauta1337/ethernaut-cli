const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./remove/autocomplete/alias')
const storage = require('../internal/storage')

const remove = require('../scopes/net')
  .task('remove', 'Removes a network to from cli')
  .addOptionalParam(
    'alias',
    'How the network is referenced in the cli',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }) => {
    try {
      const networks = storage.readNetworks()

      if (!(alias in networks)) {
        throw new Error(`The network alias ${alias} does not exist`)
      }

      delete networks[alias]

      storage.storeNetworks(networks)

      output.resultBox(`Removed network ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

remove.paramDefinitions.alias.autocomplete = autocompleteAlias
