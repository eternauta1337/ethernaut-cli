const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const EthernautCliError = require('ethernaut-common/src/error/error')

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
        throw new EthernautCliError(
          'ethernaut-network',
          'The mainnet network cannot be removed',
        )
      }

      if (!(alias in networks)) {
        throw new EthernautCliError(
          'ethernaut-network',
          `The network alias ${alias} does not exist`,
        )
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
