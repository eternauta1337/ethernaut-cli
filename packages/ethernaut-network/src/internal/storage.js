const fs = require('fs')
const path = require('path')
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('common/src/create-file')

/**
 * Stores data like this:
 * <hardhat-project>/
 *   artifacts/
 *     network/
 *       networks.json
 *
 * networks.json schema:
 * {
 *    networkAlias1: {
 *      url: 'http://some-url/${SOME_API_KEY}'
 *    }
 * }
 */

function readNetworks() {
  return JSON.parse(fs.readFileSync(getNetworksFilePath()))
}

function storeNetworks(networks) {
  fs.writeFileSync(getNetworksFilePath(), JSON.stringify(networks, null, 2))
}

function init() {
  createFolderIfMissing(getNetworkFolderPath())
  createFileIfMissing(getNetworksFilePath(), {})
}

function getNetworkFolderPath() {
  return path.join(process.cwd(), 'artifacts', 'network')
}

function getNetworksFilePath() {
  return path.join(getNetworkFolderPath(), 'networks.json')
}

module.exports = {
  init,
  readNetworks,
  storeNetworks,
}
