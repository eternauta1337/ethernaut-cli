const loadAbi = require('ethernaut-interact/src/tasks/contract/load-abi')
const debug = require('ethernaut-common/src/debug')
const prompt = require('ethernaut-common/src/prompt')

module.exports = async function promptParamsLog({ abi, event }) {
  if (!abi) return

  try {
    const _abi = loadAbi(abi)

    const eventName = event.split('(')[0]
    const abiEvent = _abi.find((abiFn) => abiFn.name === eventName)

    let params = []
    for (const input of abiEvent.inputs) {
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
