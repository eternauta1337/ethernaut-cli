const path = require('path')
const os = require('os')

function getEthernautFolderPath() {
  return path.join(os.homedir(), '.ethernaut')
}

module.exports = {
  getEthernautFolderPath,
}
