const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/require-all')
const copyFiles = require('ethernaut-common/src/copy-files')
const spinner = require('ethernaut-common/src/spinner')
const path = require('path')
const { getEthernautFolderPath } = require('ethernaut-common/src/storage')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)

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
