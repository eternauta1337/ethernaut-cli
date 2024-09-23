const fs = require('fs')
const path = require('path')

function connect(network) {
  // Retrieve the deployed addresses for the given network
  const addresses = _getDeployedAddresses(network)
  const address = addresses['Zeronaut#Zeronaut']

  // Retrieve the game abi
  const abi = _getGameAbi(network)

  // Create the game contract instance
  // TODO
}

function _getGameAbi(network) {
  const artifactsFolderPath = path.join(
    _getNetworkFolderPath(network),
    'artifacts',
  )
  const abiPath = path.join(artifactsFolderPath, 'Zeronaut#Zeronaut.json')
  return JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi
}

function _getDeployedAddresses(network) {
  const addressesPath = path.join(
    _getNetworkFolderPath(network),
    'deployed_addresses.json',
  )
  return JSON.parse(fs.readFileSync(addressesPath, 'utf8'))
}

function _getNetworkFolderPath(network) {
  const networkFolderPath = path.join(_getIgnitionFolderPath(), network)
  const deploymentExists = fs.existsSync(networkFolderPath)
  if (!deploymentExists) {
    throw new Error(`Deployment for network ${network} not found`)
  }
  return networkFolderPath
}

function _getIgnitionFolderPath() {
  const zeronautPkgPath = require.resolve('zeronaut/package.json')
  const zeronautDir = path.dirname(zeronautPkgPath)
  return path.join(zeronautDir, 'ignition', 'deployments')
}

module.exports = { connect }
