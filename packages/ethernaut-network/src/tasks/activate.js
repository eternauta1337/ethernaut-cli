const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')
const { setNetwork } = require('../internal/set-network')

require('../scopes/network')
  .task('activate', 'Activates a network')
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
