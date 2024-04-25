const output = require('ethernaut-common/src/ui/output')
const Agora = require('../internal/agora/Agora')

require('../scopes/retro')
  .task('lists', 'Prints out all the lists of the current round')
  .setAction(async () => {
    try {
      const agora = new Agora()

      const info = await agora.retro.getProjects()
      console.log('@@@@', info)

      // TODO
      return output.resultBox('RetroPGF')
    } catch (err) {
      return output.errorBox(err)
    }
  })
