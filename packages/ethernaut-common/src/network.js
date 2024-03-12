const { chains } = require('ethernaut-common/src/chains')
const debug = require('ethernaut-common/src/debug')

async function getNetworkName(hre) {
  const chainId = await getChainId(hre)

  // Code below would return 'GoChain Testnet' otherwise
  if (chainId === 31337) {
    return 'local'
  }

  // Look up the chain id in the hardcoded list
  const chain = chains.find((c) => c.chainId === chainId)
  return chain ? chain.name.toLowerCase() : 'local'
}

async function getChainId(hre) {
  // Get the chain id from the ethers provider
  const provider = hre.ethers.provider
  debug.log(provider, 'network-deep')
  const network = (await provider.getNetwork()).toJSON()
  return Number(network.chainId)
}

module.exports = {
  getNetworkName,
  getChainId,
}
