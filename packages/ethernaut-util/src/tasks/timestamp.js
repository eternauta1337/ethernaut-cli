const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')

const SECONDS_IN = {
  seconds: 1,
  minutes: 60,
  hours: 60 * 60,
  days: 60 * 60 * 24,
  weeks: 60 * 60 * 24 * 7,
  years: 60 * 60 * 24 * 365,
}

const timeOptions = Object.keys(SECONDS_IN)

const task = require('../scopes/util')
  .task(
    'timestamp',
    `Returns current timestamp X units of time in the future. Units can be one of ${timeOptions.join(', ')}.`,
  )
  .addParam(
    'offset',
    'The offset to add to the current timestamp',
    0,
    types.int,
  )
  .addParam('unit', 'The unit of time to advance', 'days', types.string)
  .setAction(async ({ offset, unit }) => {
    try {
      // Convert the value to a number
      const numericValue = Number(offset)

      // Get the current timestamp
      const currentTimestamp = Math.floor(Date.now() / 1000)

      // Calculate future timestamp
      const futureTimestamp = currentTimestamp + numericValue * SECONDS_IN[unit]

      return output.resultBox(futureTimestamp.toString())
    } catch (err) {
      return output.errorBox(err.message)
    }
  })

task.paramDefinitions.unit.isOptional = false

module.exports = {
  timeOptions,
}
