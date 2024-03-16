const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/io/require-all')
const copyFiles = require('ethernaut-common/src/util/copy-files')
const spinner = require('ethernaut-common/src/ui/spinner')
const path = require('path')
const { getEthernautFolderPath } = require('ethernaut-common/src/io/storage')
const output = require('ethernaut-common/src/ui/output')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)
  output.setErrorVerbose(hre.hardhatArguments.verbose)

  copyFiles(
    path.resolve(__dirname, 'abis'),
    path.resolve(getEthernautFolderPath(), 'interact', 'abis'),
  )
})

extendConfig((config) => {
  const interactConfig = require('./internal/assistants/configs/interact.json')

  if (config.ethernaut?.ai) {
    config.ethernaut.ai.interpreter.additionalInstructions.push(
      interactConfig.additionalInstructions,
    )
  }
})
