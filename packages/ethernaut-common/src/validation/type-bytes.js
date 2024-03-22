const { types } = require('hardhat/config')
const { isBytes } = require('../util/bytes')
const output = require('../ui/output')

module.exports = {
  name: 'bytes',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
      if (!isBytes(argValue)) {
        throw new Error(`Invalid bytes: ${argValue}`)
      }
    } catch (err) {
      output.errorBox(err)

      if (typeof describe === 'function') {
        throw err
      }

      return false
    }

    return true
  },
}
