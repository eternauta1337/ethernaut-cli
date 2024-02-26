const output = require('common/src/output')
const storage = require('../internal/storage')

require('../scopes/net')
  .task('active', 'Prints the active network')
  .setAction(async () => {
    try {
      const networks = storage.readNetworks()
      output.resultBox(`Active network is ${networks.activeNetwork}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
