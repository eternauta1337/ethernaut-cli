const storage = require('ethernaut-interact/src/internal/storage')
const paramsPrompt = require('./params')

module.exports = async function promptParamsERC20({ fn }) {
  const abi = storage.findAbi('ERC20')

  return await paramsPrompt({ abi, fn })
}
