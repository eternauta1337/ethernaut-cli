const { types } = require('hardhat/config')
const { isAddress } = require('./address')
const output = require('./output')

module.exports = {
  name: 'address',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
      if (!isAddress(argValue)) {
        throw new Error('Invalid address')
      }
    } catch (err) {
      output.errorBoxStr(
        `"${argValue}" is not an address`,
        `Invalid ${argName}`,
      )
      process.exit(1)
    }
  },
}
