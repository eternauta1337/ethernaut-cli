const loadAbi = require('ethernaut-interact/src/tasks/contract/load-abi')
const debug = require('common/src/debug')
const prompt = require('common/src/prompt')

module.exports = async function promptParams({ abi, fn }) {
  if (!abi) return

  try {
    const _abi = loadAbi(abi)

    const fnName = fn.split('(')[0]
    const abiFn = _abi.find((abiFn) => abiFn.name === fnName)

    let params = []
    for (const input of abiFn.inputs) {
      const response = await prompt({
        type: 'input',
        message: `Enter ${input.name} (${input.type})`,
      })

      params.push(response)
    }

    return params.join(',')
  } catch (err) {
    debug.log(err, 'interact')
  }
}
