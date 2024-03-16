const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')

require('../scopes/wallet')
  .task('current', 'Shows which wallet is active')
  .setAction(async () => {
    try {
      const signers = storage.readSigners()
      console.log(signers)
      if (Object.keys(signers).length < 2) {
        throw new Error(
          'No wallets found. Please use the create task to add one.',
        )
      }

      const signer = signers[signers.activeSigner]
      if (!signer) {
        throw new Error(
          'No active wallet found. Please use the activate task to set one.',
        )
      }

      return output.resultBox(
        `The current wallet is "${signers.activeSigner}" with address ${signer.address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
