const { types } = require('hardhat/config')
const output = require('../ui/output')

module.exports = {
  name: 'int',
  parse: function (argName, argValue) {
    return argValue
  },
  validate: (argName, argValue) => {
    try {
      types.int.validate(argName, parseInt(argValue, 10))
    } catch (err) {
      output.errorBox(err, false)

      if (typeof describe === 'function') {
        throw err
      }

      return false
    }

    return true
  },
}
