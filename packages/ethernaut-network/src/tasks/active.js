const output = require('common/src/output')
const storage = require('../internal/storage')

require('../scopes/net')
  .task('active', 'Prints the active network')
  .setAction(async () => {
    try {
      const networks = storage.readNetworks()
      const network = networks[networks.activeNetwork]
      output.resultBox(
        `The active network is "${networks.activeNetwork}" with url ${network.url}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
