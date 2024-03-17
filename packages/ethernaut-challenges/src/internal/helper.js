const fs = require('fs')
const path = require('path')
const { getEthernautFolderPath } = require('ethernaut-common/src/io/storage')

function getGamedata() {
  const filePath = path.join(getGamedataPath(), 'gamedata.json')

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getDeploymentInfo(network) {
  const filePath = path.join(getGamedataPath(), `deploy.${network}.json`)
  if (!fs.existsSync(filePath)) {
    let msg = `No deployment found on ${network}. Try connecting to one of the following networks:\n`
    msg += '\n'
    msg += '- Goerli Arbitrum\n'
    msg += '- Goerli Optimism\n'
    msg += '- Goerli\n'
    msg += '- Holesky\n'
    msg += '- Mumbai Polygon\n'
    msg += '- Rinkeby\n'
    msg += '- Ropsten\n'
    msg += '- Sepolia Arbitrum\n'
    msg += '- Sepolia Optimism\n'
    msg += '- Sepolia'
    throw new Error(msg)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getLevelAddress(level, network) {
  const idx = parseInt(level) - 1
  const deploymentInfo = getDeploymentInfo(network)
  return deploymentInfo[idx]
}

function getLevelDescription(descriptionFileName) {
  const filePath = path.join(
    getGamedataPath(),
    'en',
    'descriptions',
    'levels',
    descriptionFileName,
  )

  return fs.readFileSync(filePath, 'utf8')
}

function getEthernautAbi() {
  const filePath = path.join(getAbisPath(), 'Ethernaut.json')

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getAbi(abiName) {
  const filePath = path.join(getAbisPath(), `${abiName}.json`)

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

// ------------------------
// Paths
// ------------------------

function getAbisPath() {
  return path.join(getEthernautFolderPath(), 'interact', 'abis')
}

function getSourcesPath() {
  return path.join(__dirname, '..', '..', 'contracts', 'levels')
}

function getGamedataPath() {
  return path.join(__dirname, '..', '..', 'gamedata')
}

module.exports = {
  getGamedata,
  getDeploymentInfo,
  getLevelDescription,
  getGamedataPath,
  getAbisPath,
  getSourcesPath,
  getEthernautAbi,
  getAbi,
  getLevelAddress,
}
