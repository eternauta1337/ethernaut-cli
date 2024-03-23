const { types } = require('hardhat/config')
const output = require('../ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = {
  name: 'int',
  parse: function (argName, argValue) {
    return argValue
  },
  validate: (argName, argValue) => {
    try {
      types.int.validate(argName, parseInt(argValue, 10))
    } catch (err) {
      const ethErr = new EthernautCliError(
        'ethernaut-common',
        err.message,
        false,
      )

      output.errorBox(ethErr)

      if (typeof describe === 'function') {
        throw err
      }

      return false
    }

    return true
  },
}
