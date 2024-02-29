const { types } = require('hardhat/config')
const output = require('common/src/output')
const storage = require('../internal/storage')
const { getWallet } = require('../internal/signers')

require('../scopes/wallet')
  .task('sign', 'Signs a message with a wallet')
  .addOptionalPositionalParam(
    'message',
    'The message to sign',
    undefined,
    types.string,
  )
  .setAction(async ({ message }) => {
    try {
      const signers = storage.readSigners()
      const signer = signers[signers.activeSigner]

      const wallet = getWallet(signer.pk)

      output.resultBox(wallet.signMessageSync(message))
    } catch (err) {
      return output.errorBox(err)
    }
  })
