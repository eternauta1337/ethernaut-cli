const { types } = require('hardhat/config')
const output = require('../ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = {
  name: 'string',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
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
