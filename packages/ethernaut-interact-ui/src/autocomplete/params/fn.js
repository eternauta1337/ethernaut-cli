const loadAbi = require('ethernaut-interact/src/tasks/contract/load-abi')
const {
  getFunctionSignature,
  getPopulatedFunctionSignature,
} = require('ethernaut-interact/src/internal/signatures')
const debug = require('common/src/debug')
const prompt = require('common/src/prompt')

module.exports = async function autocompleteFn({ fn, abi }) {
  if (!abi) return

  if (fn !== undefined) return

  try {
    const _abi = loadAbi(abi)
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
    debug.log(err, 'interact')
  }
}
