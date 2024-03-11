const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')

require('../scopes/wallet')
  .task('list', 'Lists all wallets')
  .setAction(async () => {
    try {
      const signers = storage.readSigners()
      const activeSigner = signers.activeSigner
      const strs = []
      Object.entries(signers).forEach(([name, signer]) => {
        if (name === 'activeSigner') return
        const active = activeSigner === name ? '>' : '-'
        strs.push(`${active} ${name} (${signer.address})`)
      })
      return output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
