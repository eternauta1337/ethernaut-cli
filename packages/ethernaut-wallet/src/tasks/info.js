const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/wallet')
  .task('info', 'Shows information about a wallet')
  .addPositionalParam(
    'alias',
    'The name of the wallet',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }, hre) => {
    try {
      if (!alias) {
        throw new EthernautCliError(
          'ethernaut-wallet',
          'You must specify a wallet',
        )
      }

      let info = {}

      info.alias = alias

      const signers = storage.readSigners()
      const signer = signers[alias]
      if (!signer) {
        throw new EthernautCliError(
          'ethernaut-wallet',
          `Unknown wallet: ${alias}`,
        )
      }
      info.address = signer.address

      info.balance = await hre.ethers.provider.getBalance(info.address)

      let str = ''
      str += `Alias: ${info.alias}\n`
      str += `Address: ${info.address}\n`
      str += `Balance: ${hre.ethers.formatEther(info.balance)} ETH`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
