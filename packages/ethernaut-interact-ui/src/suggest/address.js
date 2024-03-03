const storage = require('ethernaut-interact/src/internal/storage')
const debug = require('common/src/debug')
const { getNetworkName } = require('common/src/network')

module.exports = async function suggestAddress({ abi, address, hre }) {
  if (!abi) return

  if (address !== undefined) return

  try {
    const network = await getNetworkName(hre)

    debug.log(`Looking for addresses for ABI ${abi}`, 'interact')
    const addresses = storage.findAddressWithAbi(abi, network)
    debug.log(`Addresses used with ${abi}: ${addresses}`, 'interact')

    return addresses
  } catch (err) {
    debug.log(err)
  }
}
