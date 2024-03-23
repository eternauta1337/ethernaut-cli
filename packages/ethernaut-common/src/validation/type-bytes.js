const { types } = require('hardhat/config')
const { isBytes } = require('../util/bytes')
const output = require('../ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = {
  name: 'bytes',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
      if (!isBytes(argValue)) {
        throw new EthernautCliError(
          'ethernaut-common',
          `Invalid bytes: ${argValue}`,
          false,
        )
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
