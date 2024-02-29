const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./autocomplete/alias')
const storage = require('../internal/storage')

const edit = require('../scopes/network')
  .task('edit', 'Edits a network')
  .addOptionalPositionalParam(
    'alias',
    'The name of the network',
    undefined,
    types.string,
  )
  .addOptionalParam('url', 'The network url', undefined, types.string)
  .setAction(async ({ alias, url }) => {
    try {
      const networks = storage.readNetworks()

      if (!(alias in networks)) {
        throw new Error(`The network alias ${alias} does not exist`)
      }

      networks[alias].url = url

      storage.storeNetworks(networks)

      output.resultBox(`Updated network ${alias} with url ${url}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

edit.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a network to edit')
