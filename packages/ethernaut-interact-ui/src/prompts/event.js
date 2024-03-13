const loadAbi = require('ethernaut-interact/src/tasks/contract/load-abi')
const {
  getEventSignature,
} = require('ethernaut-interact/src/internal/signatures')
const debug = require('ethernaut-common/src/debug')
const prompt = require('ethernaut-common/src/prompt')

module.exports = async function promptEvent({ abi }) {
  if (!abi) return

  try {
    const _abi = loadAbi(abi)
    const isEvent = (fn) => fn.type === 'event'
    const abiEvents = _abi.filter((el) => isEvent(el))
    const choices = abiEvents.map((event) => ({
      title: getEventSignature(event),
      value: event.name,
    }))

    return await prompt({
      type: 'autocomplete',
      message: 'Pick an event',
      limit: 15,
      choices,
    })
  } catch (err) {
    debug.log(err, 'interact')
  }
}
