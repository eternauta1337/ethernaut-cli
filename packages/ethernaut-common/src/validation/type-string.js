const { types } = require('hardhat/config')
const output = require('../ui/output')

module.exports = {
  name: 'string',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
    } catch (err) {
      output.errorBoxStr(`"${argValue}" is not string`, `Invalid ${argName}`)

      if (typeof describe === 'function') {
        throw err
      }

      return false
    }

    return true
  },
}
