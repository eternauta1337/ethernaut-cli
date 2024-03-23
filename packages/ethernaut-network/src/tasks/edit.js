const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/network')
  .task('edit', 'Edits a network')
  .addPositionalParam(
    'alias',
    'The name of the network',
    undefined,
    types.string,
  )
  .addParam('url', 'The network url', undefined, types.string)
  .setAction(async ({ alias, url }) => {
    try {
      const networks = storage.readNetworks()

      if (!(alias in networks)) {
        throw new EthernautCliError(
          'ethernaut-network',
          `The network alias ${alias} does not exist`,
          false,
        )
      }

      networks[alias].url = url

      storage.storeNetworks(networks)

      return output.resultBox(`Updated network ${alias} with url ${url}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
