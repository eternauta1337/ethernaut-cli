const loadAbi = require('ethernaut-interact/src/internal/load-abi')
const {
  getFunctionSignature,
  getFullFunctionSignature,
} = require('ethernaut-interact/src/internal/signatures')
const debug = require('ethernaut-common/src/ui/debug')
const prompt = require('ethernaut-common/src/ui/prompt')

module.exports = async function promptFn({ abi }) {
  if (!abi) return

  try {
    const _abi = loadAbi(abi)
    const isFunction = (fn) => fn.type === 'function'
    const abiFns = _abi.filter((el) => isFunction(el))
    const choices = abiFns.map((fn) => ({
      title: getFullFunctionSignature(fn),
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
