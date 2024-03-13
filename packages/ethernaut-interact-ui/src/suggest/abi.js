const fs = require('fs')
const path = require('path')
const { getChainId } = require('ethernaut-common/src/network')
const similarity = require('string-similarity')
const storage = require('ethernaut-interact/src/internal/storage')
const debug = require('ethernaut-common/src/debug')

module.exports = async function suggestAbi({ abi, hre, address }) {
  try {
    const chainId = await getChainId(hre)

    // Try to complete a partial abi path
    if (abi && !isValidJsonFile(abi)) {
      const abis = storage.readAbiFiles()
      const matches = similarity.findBestMatch(
        abi,
        abis.map((a) => a.name),
      )
      if (matches) {
        const match = abis.find((a) => a.name === matches.bestMatch.target)
        if (match) {
          debug.log(
            `Matched incoming ABI "${abi}" with known ABI "${match.path}"`,
            'interact',
          )

          return match.path
        }
      }
    }
    if (abi) return abi

    // Try to deduce the abi from previous interactions
    // in the current network
    if (address) {
      abi = deduceAbiFromAddress(address, chainId)
      if (abi) return abi
    } else {
      debug.log('Cannot deduce from address', 'interact')
    }

    return abi
  } catch (err) {
    debug.log(err, 'interact')
  }
}

function deduceAbiFromAddress(address, chainId) {
  const addresses = storage.readAddresses()[chainId]
  if (!addresses) {
    debug.log(
      `No addresses found for network with chain id ${chainId}`,
      'interact',
    )
    return undefined
  }
  debug.log(
    `Found ${Object.keys(addresses).length} addresses on network with chain id ${chainId}`,
    'interact',
  )

  const abi = addresses[address]
  if (!abi) {
    debug.log(
      `No address entry found for ${address} on network with chain id ${chainId}`,
      'interact',
    )
    return
  }

  debug.log(`Found ...${abi.split('/').pop()} for ${address}`, 'interact')

  return abi
}

function isValidJsonFile(abi) {
  if (path.extname(abi) !== '.json') {
    return false
  }

  if (!fs.existsSync(abi)) {
    return false
  }

  return true
}
