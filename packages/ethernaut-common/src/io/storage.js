const fs = require('fs')
const path = require('path')
const os = require('os')
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('ethernaut-common/src/io/create-file')

function readConfig() {
  init()

  const data = fs.readFileSync(getConfigPath())

  return JSON.parse(data)
}

function saveConfig(config) {
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2))
}

function getConfigPath() {
  return path.join(getEthernautFolderPath(), 'config.json')
}

function getEthernautFolderPath() {
  return path.join(os.homedir(), '.ethernaut')
}

function init(defaultConfig = {}) {
  createFolderIfMissing(getEthernautFolderPath())
  createFileIfMissing(getConfigPath(), () => defaultConfig)
}

module.exports = {
  init,
  readConfig,
  saveConfig,
  getEthernautFolderPath,
}
