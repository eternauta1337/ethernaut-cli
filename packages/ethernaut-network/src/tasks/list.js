const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')

require('../scopes/network')
  .task('list', 'Prints all networks')
  .setAction(async () => {
    try {
      const networks = storage.readNetworks()
      const activeNetwork = networks.activeNetwork
      const strs = []
      Object.entries(networks).forEach(([name, network]) => {
        if (name === 'activeNetwork') return
        const active = activeNetwork === name ? '>' : '-'
        strs.push(`${active} ${name} (${network.url})`)
      })
      return output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
