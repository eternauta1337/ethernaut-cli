const { types } = require('hardhat/config')
const { isBytes32 } = require('../util/bytes')
const output = require('../ui/output')

module.exports = {
  name: 'bytes32',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
      if (!isBytes32(argValue)) {
        throw new Error(`Invalid bytes32: ${argValue}`)
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
