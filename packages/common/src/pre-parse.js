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
  debug.log(
    `Pre-parsing... ${JSON.stringify(process.argv, null, 2)}`,
    'parse-deep',
  )

  const argumentsParser = new ArgumentsParser()
  const allUnparsedCLAs = getUnparsedCLAs(argumentsParser)

  const { taskDefinitions, scopesDefinitions } = getScopesAndTasks(hre)

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
    success = false
  }

  return { success, args: allUnparsedCLAs }
}

function getScopesAndTasks(hre) {
  const nodes = getNodes(hre)
  const tasks = nodes.filter((node) => !node.isScope)
  const scopes = nodes.filter((node) => node.isScope)

  const taskDefinitions = tasks.reduce((map, task) => {
    const name = task._task || task.parentTaskDefinition._task
    map[name] = task
    return map
  }, {})

  const scopesDefinitions = scopes.reduce((map, scope) => {
    map[scope.name] = scope
    return map
  }, {})

  return { taskDefinitions, scopesDefinitions }
}

function getUnparsedCLAs(argumentsParser) {
  if (_allUnparsedCLAs === undefined) {
    // Parse env variables
    const envVariableArguments = getEnvHardhatArguments(
      HARDHAT_PARAM_DEFINITIONS,
      process.env,
    )
    debug.log(
      `envVariableArguments: ${JSON.stringify(envVariableArguments, null, 2)}`,
      'parse-deep',
    )

    // Parse hardhat arguments, scope and tasks
    const { hardhatArguments, scopeOrTaskName, allUnparsedCLAs } =
      argumentsParser.parseHardhatArguments(
        HARDHAT_PARAM_DEFINITIONS,
        envVariableArguments,
        process.argv.slice(2),
      )
    debug.log(
      `hardhatArguments: ${JSON.stringify(hardhatArguments, null, 2)}`,
      'parse-deep',
    )
    debug.log(`scopeOrTaskName: ${scopeOrTaskName}`, 'parse-deep')
    debug.log(`allUnparsedCLAs: ${allUnparsedCLAs}`, 'parse-deep')
    return allUnparsedCLAs
  } else {
    return _allUnparsedCLAs
  }
}

function setArgs(args) {
  _allUnparsedCLAs = args
}

prepareParser()

module.exports = {
  preParse,
  setArgs,
}
