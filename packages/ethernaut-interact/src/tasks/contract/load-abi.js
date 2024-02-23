const fs = require('fs')

module.exports = function loadAbi(abiPath) {
  if (!abiPath) return undefined

  let abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'))

  if (abi.abi) {
    abi = abi.abi
  }

  return abi
}
