const storage = require('ethernaut-interact/src/internal/storage')
const debug = require('ethernaut-common/src/ui/debug')
const { getNetworkName } = require('ethernaut-common/src/util/network')

module.exports = async function suggestAddress({ abi, address, hre }) {
  if (address) return address

  if (!abi) return

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
