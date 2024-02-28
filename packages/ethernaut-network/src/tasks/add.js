const { types } = require('hardhat/config')
const output = require('common/src/output')
const autocompleteUrl = require('./autocomplete/url')
const storage = require('../internal/storage')

const add = require('../scopes/net')
  .task('add', 'Adds a network to the cli')
  .addOptionalPositionalParam(
    'alias',
    'How the network will be referenced from the cli',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'url',
    'The url of the network provider, e.g. https://ethereum-rpc.publicnode.com. Note: Environment variables may be included, e.g. https://eth-mainnet.alchemyapi.io/v2/${INFURA_API_KEY}. Make sure to specify these in your .env file.',
    undefined,
    types.string,
  )
  .setAction(async ({ alias, url }) => {
    try {
      const validateAlias = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
      if (!validateAlias.test(alias)) {
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

      storage.storeNetworks(networks)

      output.resultBox(`Added network ${alias} with provider ${url}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

add.paramDefinitions.url.autocomplete = autocompleteUrl
