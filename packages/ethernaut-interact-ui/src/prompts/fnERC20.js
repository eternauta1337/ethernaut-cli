const loadAbi = require('ethernaut-interact/src/tasks/contract/load-abi')
const {
  getFunctionSignature,
  getPopulatedFunctionSignature,
} = require('ethernaut-interact/src/internal/signatures')
const debug = require('ethernaut-common/src/debug')
const prompt = require('ethernaut-common/src/prompt')
const storage = require('ethernaut-interact/src/internal/storage')

module.exports = async function promptFnERC20() {
  try {
    const _abi = loadAbi(storage.findAbi('ERC20'))
    const isFunction = (fn) => fn.type === 'function'
    const abiFns = _abi.filter((el) => isFunction(el))
    const choices = abiFns.map((fn) => ({
      title: getPopulatedFunctionSignature(fn),
      value: getFunctionSignature(fn),
    }))

    return await prompt({
      type: 'autocomplete',
      message: 'Pick a function',
      limit: 15,
      choices,
    })
  } catch (err) {
    debug.log(err, 'ui')
  }
}
