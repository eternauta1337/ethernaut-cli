const { types } = require('hardhat/config')
const output = require('./output')

module.exports = {
  name: 'ens',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)

      const isEns = argValue.endsWith('.eth')
      if (!isEns) {
        throw new Error('Invalid ens')
      }
    } catch (err) {
      output.errorBoxStr(`"${argValue}" is not an ens`, `Invalid ${argName}`)

      if (typeof describe === 'function') {
        throw err
      }
    }
  },
}
