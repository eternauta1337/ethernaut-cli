const storage = require('../internal/storage')
const debug = require('ethernaut-common/src/debug')
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
  if (!networks.activeNetwork || !networks[networks.activeNetwork]) {
    networks.activeNetwork = 'localhost'
    storage.storeNetworks(networks)
  }

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

  hre.ethers.provider = new hre.ethers.JsonRpcProvider(
    hre.config.networks[alias].url,
  )
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
