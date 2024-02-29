const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./autocomplete/alias')
const storage = require('../internal/storage')

const remove = require('../scopes/network')
  .task('remove', 'Removes a network from the cli')
  .addOptionalPositionalParam(
    'alias',
    'The name of the network',
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

      if (networks.activeNetwork === alias) {
        networks.activeNetwork = 'localhost'
      }

      storage.storeNetworks(networks)

      output.resultBox(`Removed network ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

remove.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a network to remove')
