const { preParse, setArgs } = require('common/src/pre-parse')
const debug = require('common/src/debug')
const output = require('common/src/output')

module.exports = function preParseAi(hre) {
  debug.log('Ai pre parse...', 'parse')

  const { success, args } = preParse(hre)

  // If pre-parsing succeeded, just use the args normally.
  // If it fails, then wrap the args and send them to the ai's interpret task.
  if (success) {
    setArgs(args)
  } else {
    const newArgs = ['ai', 'interpret', '--new-thread', args.join(' ')]
    debug.log(`Modifying args to: ${newArgs}`, 'parse')
    output.info('Uh? Not sure what you mean, interpreting with ai...')
    setArgs(newArgs)
  }
}
