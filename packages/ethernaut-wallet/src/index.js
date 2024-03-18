const { extendEnvironment, extendConfig } = require('hardhat/config')
const requireAll = require('ethernaut-common/src/io/require-all')
const spinner = require('ethernaut-common/src/ui/spinner')
const storage = require('./internal/storage')
const {
  modifySigners,
  ensureActiveSigner,
  createRandomSigner,
} = require('./internal/signers')
const output = require('ethernaut-common/src/ui/output')

requireAll(__dirname, 'tasks')

extendEnvironment((hre) => {
  spinner.enable(!hre.hardhatArguments.verbose)
  output.setErrorVerbose(hre.hardhatArguments.verbose)

  modifySigners(hre)

  storage.init(() => {
    return {
      activeSigner: 'default',
      default: createRandomSigner(hre),
    }
  })

  ensureActiveSigner()
})

extendConfig((config) => {
  const walletConfig = require('./internal/assistants/configs/wallet.json')

  if (config.ethernaut?.ai) {
    config.ethernaut.ai.interpreter.additionalInstructions.push(
      walletConfig.additionalInstructions,
    )
  }
})
