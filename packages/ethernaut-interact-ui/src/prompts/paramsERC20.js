const loadAbi = require('ethernaut-interact/src/tasks/contract/load-abi')
const debug = require('ethernaut-common/src/debug')
const prompt = require('ethernaut-common/src/prompt')
const storage = require('ethernaut-interact/src/internal/storage')

module.exports = async function promptParamsERC20({ fn }) {
  try {
    const _abi = loadAbi(storage.findAbi('ERC20'))

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
    debug.log(err, 'ui')
  }
}
