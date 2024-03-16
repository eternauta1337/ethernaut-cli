const { preParse, setArgs } = require('ethernaut-common/src/tasks/pre-parse')
const debug = require('ethernaut-common/src/util/debug')
const output = require('ethernaut-common/src/ui/output')

module.exports = function preParseAi(hre) {
  if (global.testing) return

  debug.log('Ai pre parse...', 'parse')

  const { success, args } = preParse(hre)

  // If pre-parsing succeeded, just use the args normally.
  // If it fails, then wrap the args and send them to the ai's interpret task.
  if (success) {
    setArgs(args)
  } else {
    const newArgs = ['ai', 'interpret', args.join(' ')]
    debug.log(`Modifying args to: ${newArgs}`, 'parse')
    output.info('Interpreting natural language query with ai...')
    setArgs(newArgs)
  }
}
