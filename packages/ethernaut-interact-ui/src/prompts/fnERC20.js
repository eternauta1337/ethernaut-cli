const storage = require('ethernaut-interact/src/internal/storage')
const fnPrompt = require('./fn')

module.exports = async function promptFnERC20() {
  const abi = storage.findAbi('ERC20')

  return await fnPrompt({ abi })
}
