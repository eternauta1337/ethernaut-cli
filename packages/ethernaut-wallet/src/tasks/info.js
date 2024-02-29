const output = require('common/src/output')
const storage = require('../internal/storage')
const autocompleteAlias = require('./autocomplete/alias')

const info = require('../scopes/wallet')
  .task('info', 'Provides information about a signer')
  .addOptionalPositionalParam(
    'alias',
    'An alias to the signer to get information about',
  )
  .setAction(async ({ alias }, hre) => {
    try {
      if (!alias) {
        throw new Error('You must specify a signer')
      }

      let info = {}

      info.alias = alias

      const signers = storage.readSigners()
      const signer = signers[alias]
      if (!signer) {
        throw new Error(`Unknown signer: ${alias}`)
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

info.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
  autocompleteAlias('Select a network')
