const fs = require('fs')
const path = require('path')

module.exports = function isValidJsonFile(abi) {
  if (path.extname(abi) !== '.json') {
    return false
  }

  if (!fs.existsSync(abi)) {
    return false
  }

  return true
}
