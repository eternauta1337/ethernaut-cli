const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')

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
        throw new Error('You must specify a wallet')
      }

      let info = {}

      info.alias = alias

      const signers = storage.readSigners()
      const signer = signers[alias]
      if (!signer) {
        throw new Error(`Unknown wallet: ${alias}`)
      }
      info.address = signer.address

      info.balance = await hre.ethers.provider.getBalance(info.address)

      let str = ''
      str += `Alias: ${info.alias}\n`
      str += `Address: ${info.address}\n`
      str += `Balance: ${hre.ethers.formatEther(info.balance)} ETH`

      output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
