const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')

const task = require('../scopes/util')
  .task(
    'date',
    'Converts a Unix timestamp to human-readable UTC and local time.',
  )
  .addPositionalParam(
    'timestamp',
    'The Unix timestamp to convert',
    undefined,
    types.int,
  )
  .setAction(async ({ timestamp }) => {
    try {
      // Convert timestamp to a number
      const numericTimestamp = Number(timestamp) * 1000
      const date = new Date(numericTimestamp)

      // Get UTC and local time formats
      const utcString = date.toUTCString()
      const localString = date.toString()

      // Display results
      return output.resultBox(`UTC: ${utcString}\nLocal: ${localString}`)
    } catch (err) {
      return output.errorBox(err.message)
    }
  })

module.exports = {
  task,
}
