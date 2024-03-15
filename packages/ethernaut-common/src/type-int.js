const { types } = require('hardhat/config')
const output = require('./output')

module.exports = {
  name: 'int',
  parse: function (argName, argValue) {
    return argValue
  },
  validate: (argName, argValue) => {
    try {
      types.int.validate(argName, argValue)
    } catch (err) {
      output.errorBoxStr(`"${argValue}" is not an int`, `Invalid ${argName}`)

      if (typeof describe === 'function') {
        throw err
      }
    }
  },
}
