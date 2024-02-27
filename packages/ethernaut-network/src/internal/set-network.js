const storage = require('../internal/storage')
const {
  createProvider,
} = require('hardhat/internal/core/providers/construction')
const {
  HardhatEthersProvider,
} = require('@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider')
const debug = require('common/src/debug')
const applyEnvVars = require('./apply-env-vars')

async function setActiveNetwork(hre) {
  if (hre.hardhatArguments.network) {
    debug.log(
      `Ignoring active network because --network is set to "${hre.hardhatArguments.network}"`,
      'network',
    )
    return
  }

  debug.log('Setting active network', 'network')
  const networks = storage.readNetworks()
  await setNetwork(networks.activeNetwork, hre)
}

async function setNetwork(alias, hre) {
  debug.log(`Setting network ${alias}`, 'network')
  const networks = storage.readNetworks()

  let network
  if (alias !== 'localhost') {
    network = networks[alias]
    injectNetworkInConfig(alias, network, hre.config)
  } else {
    network = hre.config.networks[alias]
  }

  const provider = await createProvider(hre.config, alias)

  hre.ethers.provider = new HardhatEthersProvider(provider, alias)
}

function injectNetworkInConfig(alias, network, config) {
  if (config.networks[alias]) return

  config.networks[alias] = {
    accounts: 'remote',
    gas: 'auto',
    gasPrice: 'auto',
    gasMultiplier: 1,
    httpHeaders: {},
    timeout: 40000,
    url: applyEnvVars(network.url),
  }
}

module.exports = {
  setActiveNetwork,
  setNetwork,
}
