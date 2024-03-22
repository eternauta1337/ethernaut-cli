const { HardhatPluginError } = require('hardhat/plugins')

class EthernautCliError extends HardhatPluginError {
  constructor(plugin, message, shouldBeReported = true) {
    super(plugin, message)

    this.shouldBeReported = shouldBeReported
  }
}

module.exports = EthernautCliError
