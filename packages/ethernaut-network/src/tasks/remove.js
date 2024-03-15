const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')

require('../scopes/network')
  .task('remove', 'Removes a network from the cli')
  .addPositionalParam(
    'alias',
    'The name of the network',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }) => {
    try {
      const networks = storage.readNetworks()

      if (alias === 'mainnet') {
        throw new Error('The mainnet network cannot be removed')
      }

      if (!(alias in networks)) {
        throw new Error(`The network alias ${alias} does not exist`)
      }

      delete networks[alias]

      if (networks.activeNetwork === alias) {
        networks.activeNetwork = 'mainnet'
      }

      storage.storeNetworks(networks)

      return output.resultBox(`Removed network ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
