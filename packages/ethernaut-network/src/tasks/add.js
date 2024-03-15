const types = require('ethernaut-common/src/types')
const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')
const { validateVarName } = require('ethernaut-common/src/name')

require('../scopes/network')
  .task('add', 'Adds a network to the cli')
  .addPositionalParam(
    'alias',
    'The name of the network',
    undefined,
    types.string,
  )
  .addParam(
    'url',
    'The url of the network provider, e.g. https://ethereum-rpc.publicnode.com. Note: Environment variables may be included, e.g. https://eth-mainnet.alchemyapi.io/v2/${INFURA_API_KEY}. Make sure to specify these in your .env file.',
    undefined,
    types.string,
  )
  .setAction(async ({ alias, url }) => {
    try {
      if (!validateVarName(alias)) {
        throw new Error(
          `Invalid alias: ${alias}. The alias must be a valid JavaScript variable name.`,
        )
      }

      const networks = storage.readNetworks()

      if (alias in networks) {
        throw new Error(`The network alias ${alias} already exists`)
      }

      networks[alias] = {
        url,
      }

      if (networks.activeNetwork === 'localhost' && !networks.localhost) {
        networks.activeNetwork = alias
      }

      storage.storeNetworks(networks)

      return output.resultBox(`Added network ${alias} with provider ${url}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
