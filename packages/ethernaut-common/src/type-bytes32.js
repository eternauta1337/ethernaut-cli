const { types } = require('hardhat/config')
const { isBytes32 } = require('./bytes')
const output = require('./output')

module.exports = {
  name: 'bytes32',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
      if (!isBytes32(argValue)) {
        throw new Error('Invalid bytes32')
      }
    } catch (err) {
      output.errorBoxStr(
        `"${argValue}" is not a bytes32 value`,
        `Invalid ${argName}`,
      )

      if (typeof describe === 'function') {
        throw err
      }

      return false
    }

    return true
  },
}
