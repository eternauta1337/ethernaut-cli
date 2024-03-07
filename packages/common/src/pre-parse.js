const {
  getEnvHardhatArguments,
} = require('hardhat/internal/core/params/env-variables')
const {
  HARDHAT_PARAM_DEFINITIONS,
} = require('hardhat/internal/core/params/hardhat-params')
const { ArgumentsParser } = require('hardhat/internal/cli/ArgumentsParser')
const getNodes = require('common/src/get-nodes')
const debug = require('common/src/debug')

let _allUnparsedCLAs

function prepareParser() {
  const alreadyModified = ArgumentsParser.prototype.modified

  if (alreadyModified) {
    debug.log('ArgumentsParser already modified', 'parse')
    return
  }

  debug.log('Modifying ArgumentsParser...', 'parse')

  const originalParseScopeAndTaskNames =
    ArgumentsParser.prototype.parseScopeAndTaskNames

  ArgumentsParser.prototype.parseScopeAndTaskNames = function (
    allUnparsedCLAs,
    taskDefinitions,
    scopeDefinitions,
  ) {
    return originalParseScopeAndTaskNames.call(
      this,
      _allUnparsedCLAs || allUnparsedCLAs,
      taskDefinitions,
      scopeDefinitions,
    )
  }

  ArgumentsParser.prototype.modified = true

  debug.log(
    `ArgumentsParser modified: ${ArgumentsParser.prototype.parseScopeAndTaskNames}`,
    'parse-deep',
  )
}

function preParse(hre) {
  debug.log(`Pre-parsing... ${JSON.stringify(process.argv, null, 2)}`, 'parse')

  // Parse env variables
  const envVariableArguments = getEnvHardhatArguments(
    HARDHAT_PARAM_DEFINITIONS,
    process.env,
  )
  debug.log(
    `envVariableArguments: ${JSON.stringify(envVariableArguments, null, 2)}`,
    'parse',
  )

  // Parse hardhat arguments, scope and tasks
  const argumentsParser = new ArgumentsParser()
  const { hardhatArguments, scopeOrTaskName, allUnparsedCLAs } =
    argumentsParser.parseHardhatArguments(
      HARDHAT_PARAM_DEFINITIONS,
      envVariableArguments,
      process.argv.slice(2),
    )
  debug.log(
    `hardhatArguments: ${JSON.stringify(hardhatArguments, null, 2)}`,
    'parse',
  )
  debug.log(`scopeOrTaskName: ${scopeOrTaskName}`, 'parse')
  debug.log(`allUnparsedCLAs: ${allUnparsedCLAs}`, 'parse')

  const nodes = getNodes(hre)
  const tasks = nodes.filter((node) => !node.isScope)
  const scopes = nodes.filter((node) => node.isScope)
  const taskDefinitions = tasks.reduce((map, task) => {
    map[task._task] = task
    return map
  }, {})
  const scopesDefinitions = scopes.reduce((map, scope) => {
    map[scope.name] = scope
    return map
  }, {})

  let success

  try {
    let { scopeName, taskName, unparsedCLAs } =
      argumentsParser.parseScopeAndTaskNames(
        allUnparsedCLAs,
        taskDefinitions,
        scopesDefinitions,
      )
    debug.log(`Pre-parse ok: ${scopeName} ${taskName} ${unparsedCLAs}`, 'parse')
    success = true
  } catch (err) {
    debug.log(`Pre-parse failed: ${err}`, 'parse')
    const newArgs = [
      'ai',
      'interpret',
      '--new-thread',
      allUnparsedCLAs.join(' '),
    ]
    _allUnparsedCLAs = newArgs
    success = false
  }

  return { success, args: allUnparsedCLAs }
}

function setArgs(args) {
  _allUnparsedCLAs = args
}

prepareParser()

module.exports = {
  preParse,
  setArgs,
}
