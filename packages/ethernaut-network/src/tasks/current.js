const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')

require('../scopes/network')
  .task('current', 'Prints the active network')
  .setAction(async () => {
    try {
      const networks = storage.readNetworks()
      const network = networks[networks.activeNetwork]
      return output.resultBox(
        `The current network is "${networks.activeNetwork}" with url ${network.url}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
