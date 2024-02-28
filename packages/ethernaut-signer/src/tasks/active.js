const output = require('common/src/output')
const storage = require('../internal/storage')

require('../scopes/sig')
  .task('active', 'Prints the active signer')
  .setAction(async () => {
    try {
      const signers = storage.readSigners()
      const signer = signers[signers.activeSigner]
      output.resultBox(
        `The active signer is "${signers.activeSigner}" with address ${signer.address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
