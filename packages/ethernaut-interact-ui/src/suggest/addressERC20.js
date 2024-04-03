const storage = require('ethernaut-interact/src/internal/storage')
const suggestAddress = require('./address')

module.exports = async function suggestAddressERC20({ address, hre }) {
  const abi = storage.findAbi('erc20')

  return await suggestAddress({ abi, address, hre })
}
