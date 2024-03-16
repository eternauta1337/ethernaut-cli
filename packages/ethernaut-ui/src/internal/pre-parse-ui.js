const { preParse, setArgs } = require('ethernaut-common/src/tasks/pre-parse')
const debug = require('ethernaut-common/src/ui/debug')

module.exports = function preParseUi(hre) {
  if (global.testing) return

  debug.log('Ui pre parse...', 'parse')

  const { args } = preParse(hre)

  // If --non-interactive is passed, inject it in the hre
  const nonInteractiveIndex = args.indexOf('--non-interactive')
  if (nonInteractiveIndex !== -1) {
    if (hre.ethernaut === undefined) hre.ethernaut = {}
    if (hre.ethernaut.ui === undefined) hre.ethernaut.ui = {}
    hre.ethernaut.ui.nonInteractive = true

    debug.log('Non-interactive mode enabled', 'parse')

    args.splice(nonInteractiveIndex, 1)
    setArgs(args)
  }
}
