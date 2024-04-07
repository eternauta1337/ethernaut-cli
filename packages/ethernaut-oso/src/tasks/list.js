const output = require('ethernaut-common/src/ui/output')

require('../scopes/oso')
  .task('list', 'Lists Open Source Observer projects')
  .setAction(async () => {
    try {
      return output.resultBox('TODO')
    } catch (err) {
      return output.errorBox(err)
    }
  })
