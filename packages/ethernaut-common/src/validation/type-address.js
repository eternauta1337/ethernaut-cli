const { types } = require('hardhat/config')
const { isAddress } = require('../util/address')
const output = require('../ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = {
  name: 'address',
  parse: types.string.parse,
  validate: (argName, argValue) => {
    try {
      types.string.validate(argName, argValue)

      const validEns = argValue.endsWith('.eth')
      const validAddress = isAddress(argValue)
      if (!validAddress && !validEns) {
        throw new EthernautCliError(
          'ethernaut-common',
          `Invalid address ${argValue}`,
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
