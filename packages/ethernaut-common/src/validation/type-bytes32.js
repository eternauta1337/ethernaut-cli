const { types } = require('hardhat/config')
const { isBytes32 } = require('../util/bytes')
const output = require('../ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = {
  name: 'bytes32',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)
      if (!isBytes32(argValue)) {
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
