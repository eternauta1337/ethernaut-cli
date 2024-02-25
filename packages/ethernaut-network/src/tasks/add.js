const { types } = require('hardhat/config')
const output = require('common/src/output')

require('../scopes/net')
  .task('add', 'Adds a network to the cli')
  .addOptionalParam(
    'alias',
    'The name of the new network',
    undefined,
    types.string,
  )
  .setAction(async ({ alias }) => {
    try {
      output.resultBox(`Added network ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
