const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const { setNetwork } = require('../internal/set-network')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/network')
  .task('set', 'Sets the active network')
  .addPositionalParam(
    'alias',
    'The name of the network',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }, hre) => {
    try {
      const networks = storage.readNetworks()

      if (!(alias in networks)) {
        throw new EthernautCliError(
          'ethernaut-network',
          `The network alias ${alias} does not exist`,
        )
      }

      await setNetwork(alias, hre)

      networks.activeNetwork = alias
      storage.storeNetworks(networks)

      return output.resultBox(`The active network is now "${alias}"`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
