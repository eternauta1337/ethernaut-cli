const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')

require('../scopes/wallet')
  .task('current', 'Shows which wallet is active')
  .setAction(async () => {
    try {
      const signers = storage.readSigners()
      const signer = signers[signers.activeSigner]
      return output.resultBox(
        `The current wallet is "${signers.activeSigner}" with address ${signer.address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
