const fs = require('fs')
const path = require('path')
const { getEthernautFolderPath } = require('ethernaut-common/src/storage')

function getGamedata() {
  const filePath = path.join(getGamedataPath(), 'gamedata.json')

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function getDeploymentInfo(network) {
  const filePath = path.join(getGamedataPath(), `deploy.${network}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`No deployment info found for ${network}`)
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
