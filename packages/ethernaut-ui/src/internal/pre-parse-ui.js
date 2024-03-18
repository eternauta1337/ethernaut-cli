const { preParse, setArgs } = require('ethernaut-common/src/tasks/pre-parse')
const debug = require('ethernaut-common/src/ui/debug')

module.exports = function preParseUi(hre) {
  if (global.testing) return

  debug.log('Ui pre parse...', 'parse')

  const { success, args, scopesDefinitions } = preParse(hre)

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

  // Inject scope if a task is recognized
  if (!success) {
    const scope = findScope(args, scopesDefinitions)
    if (scope !== undefined) {
      setArgs([scope, ...args])
    }
  }
}

function findScope(args, scopesDefinitions) {
  const task = args[0]
  if (task === undefined) return

  let matches = []

  // Find the task in one of the scopes
  for (const scope of Object.values(scopesDefinitions)) {
    if (scope.tasks[task] !== undefined) {
      matches.push(scope.tasks[task])
    }
  }

  if (matches.length === 0) return

  // It would be nice to show a prompt if there are multiple matches,
  // but this is not possible because hardhats extendEnvironment
  // is not async
  const match = matches[0]
  return match._scope || match.parentTaskDefinition._scope
}
