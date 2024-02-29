const { types } = require('hardhat/config')
const output = require('common/src/output')
const storage = require('../internal/storage')
const { chains } = require('common/src/chains')
const { isUrl } = require('common/src/url')
const autocompleteAlias = require('./autocomplete/alias')

const info = require('../scopes/network')
  .task('info', 'Provides information about a network')
  .addOptionalPositionalParam(
    'alias',
    'The name or url of the network',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }, hre) => {
    try {
      if (!alias) {
        throw new Error('You must specify a network')
      }

      let info = {}
      if (isUrl(alias)) {
        info.url = alias
      } else {
        const networks = storage.readNetworks()
        const network = networks[alias]
        if (network) info.url = network.url
      }

      if (!info.url) {
        throw new Error(`Unknown network: ${alias}`)
      }

      info = await populateRemoteChainInfo(info, hre)
      info = populateLocalChainInfo(info)

      let str = ''
      str += `Name: ${info.name}\n`
      str += `Currency: ${info.nativeCurrency.name} (${info.nativeCurrency.symbol})\n`
      str += `URL: ${info.url}\n`
      str += `Chain ID: ${info.chainId}\n`
      str += `Gas price: ${info.gasPrice} gwei\n`
      str += `Block number: ${info.blockNumber}`

      output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })

function populateLocalChainInfo(info) {
  if (!info.chainId) {
    throw new Error('No chain ID provided')
  }

  const localInfo = chains.find((c) => c.chainId === info.chainId)

  return {
    ...info,
    ...localInfo,
  }
}

async function populateRemoteChainInfo(info, hre) {
  if (!info.url) {
    throw new Error('No URL provided')
  }

  const provider = new hre.ethers.JsonRpcProvider(info.url)
  const network = (await provider.getNetwork()).toJSON()
  info.chainId = Number(network.chainId)
  info.blockNumber = await provider.getBlockNumber()

  const feeData = await provider.getFeeData()
  info.gasPrice = hre.ethers.formatUnits(feeData.gasPrice, 'gwei')

  return info
}

info.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a network')
