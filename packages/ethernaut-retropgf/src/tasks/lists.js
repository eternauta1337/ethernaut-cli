const output = require('ethernaut-common/src/ui/output')

require('../scopes/retro')
  .task('lists', 'Prints out all the lists of the current round')
  .setAction(async () => {
    try {
      return output.resultBox('RetroPGF')
    } catch (err) {
      return output.errorBox(err)
    }
  })
