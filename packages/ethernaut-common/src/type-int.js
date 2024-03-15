const { types } = require('hardhat/config')
const output = require('./output')

module.exports = {
  name: 'int',
  parse: types.int.parse,
  validate: (argName, argValue) => {
    try {
      types.int.validate(argName, argValue)
    } catch (err) {
      output.errorBoxStr(`"${argValue}" is an int`, `Invalid ${argName}`)
    }
  },
}
