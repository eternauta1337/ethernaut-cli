const output = require('ethernaut-common/src/ui/output')

require('../scopes/optiguides')
  .task('query', 'Query the Optimism guides')
  .setAction(async (_, hre) => {
    try {
      // TODO

      return output.resultBox('TODO')
    } catch (err) {
      return output.errorBox(err)
    }
  })
