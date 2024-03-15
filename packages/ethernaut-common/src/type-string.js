const { types } = require('hardhat/config')
const output = require('./output')

module.exports = {
  name: 'string',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
    } catch (err) {
      output.errorBoxStr(`"${argValue}" is not string`, `Invalid ${argName}`)
    }
  },
}
