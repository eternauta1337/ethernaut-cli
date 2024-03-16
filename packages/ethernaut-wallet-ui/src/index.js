const { extendEnvironment } = require('hardhat/config')
const promptAlias = require('./prompts/alias')

require('ethernaut-ui/src/index')
require('ethernaut-wallet/src/index')

extendEnvironment((hre) => {
  const set = hre.scopes.wallet.tasks.set
  set.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a wallet to activate')

  const info = hre.scopes.wallet.tasks.info
  info.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a wallet')

  const remove = hre.scopes.wallet.tasks.remove
  remove.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a wallet to remove')
})
