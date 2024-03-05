const fs = require('fs')
const path = require('path')
const debug = require('common/src/debug')

module.exports = function loadAbi(abiPath) {
  if (!abiPath) return undefined

  const resolvedPath = path.resolve(abiPath)

  debug.log(`Current working directory: ${process.cwd()}`, 'interact')

  debug.log(`Loading ABI from ${resolvedPath}`, 'interact')
  const exists = fs.existsSync(resolvedPath)
  debug.log(`ABI exists: ${exists}`, 'interact')

  const data = fs.readFileSync(resolvedPath, 'utf8')
  debug.log(`ABI data: ${data}`, 'interact-deep')

  let abi = JSON.parse(data)

  if (abi.abi) {
    abi = abi.abi
  }

  return abi
}
