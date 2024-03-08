const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')

require('../scopes/wallet')
  .task('list', 'Lists all wallets')
  .setAction(async () => {
    try {
      const signers = storage.readSigners()
      const strs = []
      Object.entries(signers).forEach(([name, signer]) => {
        if (name === 'activeSigner') return
        strs.push(`- ${name} (${signer.address})`)
      })
      output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
