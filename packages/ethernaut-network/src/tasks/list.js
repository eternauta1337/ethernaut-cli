const output = require('common/src/output')
const storage = require('../internal/storage')

require('../scopes/network')
  .task('list', 'Prints all networks')
  .setAction(async () => {
    try {
      const networks = storage.readNetworks()
      const strs = []
      Object.entries(networks).forEach(([name, network]) => {
        if (name === 'activeNetwork') return
        strs.push(`- ${name} (${network.url})`)
      })
      output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
