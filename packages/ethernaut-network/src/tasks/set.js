const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteAlias = require('./autocomplete/alias')
const storage = require('../internal/storage')
const { setNetwork } = require('../internal/set-network')

const set = require('../scopes/net')
  .task('set', 'Activates a network on the cli')
  .addOptionalParam(
    'alias',
    'How the network is referenced in the cli',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }, hre) => {
    try {
      const networks = storage.readNetworks()

      if (!(alias in networks)) {
        throw new Error(`The network alias ${alias} does not exist`)
      }

      await setNetwork(alias, hre)

      networks.activeNetwork = alias
      storage.storeNetworks(networks)

      output.resultBox(`The active network is now "${alias}"`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

set.paramDefinitions.alias.autocomplete = autocompleteAlias(
  'Select a network to activate',
)
