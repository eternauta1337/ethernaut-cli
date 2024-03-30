const fs = require('fs')
const path = require('path')
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('ethernaut-common/src/io/create-file')
const { getEthernautFolderPath } = require('ethernaut-common/src/io/storage')

/**
 * addresses.json schema:
 * {
 *   "sepolia": {
 *      "0x1234567890123456789012345678901234567890": "ERC20",
 *      "0x1234567890123456789012345678901234567891": "Ethernaut",
 *    },
 * }
 */

function readAddresses() {
  initStorage()

  return JSON.parse(fs.readFileSync(getAddressesFilePath(), 'utf8'))
}

function findAddressWithAbi(abi, network) {
  const networkAddresses = readAddresses()[network]
  if (!networkAddresses) return undefined

  for (const [address, addressAbi] of Object.entries(networkAddresses)) {
    if (addressAbi === abi) {
      return address
    }
  }
}

function storeAddresses(data) {
  initStorage()

  fs.writeFileSync(getAddressesFilePath(), JSON.stringify(data, null, 2))
}

function rememberAbiAndAddress(abi, address, chainId) {
  initStorage()

  address = address.toLowerCase()

  const addresses = readAddresses()

  if (!addresses[chainId]) {
    addresses[chainId] = {}
  }

  addresses[chainId][address] = abi

  storeAddresses(addresses)
}

function getAddressesFilePath() {
  return path.join(getInteractFilePath(), 'addresses.json')
}

function findAbi(name) {
  return path.join(getAbisFilePath(), `${name}.json`)
}

function storeAbi(name, abi) {
  initStorage()

  const filePath = path.join(getAbisFilePath(), `${name}.json`)

  fs.writeFileSync(filePath, JSON.stringify(abi, null, 2))

  return filePath
}

function getAbisFilePath() {
  return path.join(getInteractFilePath(), 'abis')
}

function getInteractFilePath() {
  return path.join(getEthernautFolderPath(), 'interact')
}

function initStorage() {
  createFolderIfMissing(getAbisFilePath())
  createFileIfMissing(getAddressesFilePath(), () => ({}))
}

function readAbiFiles() {
  initStorage()

  const abisPath = getAbisFilePath()

  return fs.readdirSync(abisPath).map((abiFile) => {
    return {
      name: abiFile.split('.json')[0],
      path: path.join(abisPath, abiFile),
    }
  })
}

module.exports = {
  findAbi,
  storeAbi,
  rememberAbiAndAddress,
  readAddresses,
  storeAddresses,
  readAbiFiles,
  findAddressWithAbi,
  getAbisFilePath,
}
