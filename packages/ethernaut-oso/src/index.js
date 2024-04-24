const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/io/require-all')
const spinner = require('ethernaut-common/src/ui/spinner')
const output = require('ethernaut-common/src/ui/output')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)
  output.setErrorVerbose(hre.hardhatArguments.verbose)
})

extendConfig((config) => {
  const osoConfig = require('./internal/assistants/configs/oso.json')

  if (config.ethernaut?.ai) {
    config.ethernaut.ai.interpreter.additionalInstructions.push(
      osoConfig.additionalInstructions,
    )
  }
})
