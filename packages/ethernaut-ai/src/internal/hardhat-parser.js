const {
  getEnvHardhatArguments,
} = require('hardhat/internal/core/params/env-variables')
const {
  HARDHAT_PARAM_DEFINITIONS,
} = require('hardhat/internal/core/params/hardhat-params')
const { ArgumentsParser } = require('hardhat/internal/cli/ArgumentsParser')
const getNodes = require('common/src/get-nodes')
const debug = require('common/src/debug')
const output = require('common/src/output')

let _allUnparsedCLAs

function modifyArgumentsParser() {
  debug.log('Modifying ArgumentsParser', 'parse')

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
  debug.log(
    `ArgumentsParser modified: ${ArgumentsParser.prototype.parseScopeAndTaskNames}`,
    'parse-deep',
  )
}

function preParse(hre) {
  debug.log(`Pre-parsing... ${JSON.stringify(process.argv, null, 2)}`, 'parse')

  const envVariableArguments = getEnvHardhatArguments(
    HARDHAT_PARAM_DEFINITIONS,
    process.env,
  )

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

  try {
    let { scopeName, taskName, unparsedCLAs } =
      argumentsParser.parseScopeAndTaskNames(
        allUnparsedCLAs,
        taskDefinitions,
        scopesDefinitions,
      )
    debug.log(`Pre-parse ok: ${scopeName} ${taskName} ${unparsedCLAs}`, 'parse')
    _allUnparsedCLAs = allUnparsedCLAs
  } catch (err) {
    debug.log(`Pre-parse failed: ${err}`, 'parse')
    const newArgs = [
      'ai',
      'interpret',
      '--model',
      'assistant-defined',
      '--no-confirm',
      '--new-thread',
      allUnparsedCLAs.join(' '),
    ]
    debug.log(`Modifying args to: ${newArgs}`, 'parse')
    output.info('Uh? Not sure what you mean, interpreting with ai...')
    _allUnparsedCLAs = newArgs
  }
}

module.exports = {
  modifyArgumentsParser,
  preParse,
}
