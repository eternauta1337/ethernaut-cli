const { types } = require('hardhat/config')
const output = require('../ui/output')

module.exports = {
  name: 'ens',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)

      const isEns = argValue.endsWith('.eth')
      if (!isEns) {
        throw new Error(`Invalid ens: ${argValue}`)
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
