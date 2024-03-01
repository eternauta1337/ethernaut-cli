const { task: hreTask } = require('hardhat/config')
const getNodes = require('common/src/get-nodes')
const debug = require('common/src/debug')
const output = require('common/src/output')
const camelToKebabCase = require('common/src/kebab')
const collectArguments = require('./collect-args')

let _hre

module.exports = function makeHreInteractive(hre) {
  _hre = hre

  makeTasksInteractive(hre)
}

function makeTasksInteractive(scope) {
  getNodes(scope).forEach((node) => {
    if (node.isScope) {
      makeTasksInteractive(node)
    } else if (
      node.name !== 'help' ||
      node.name !== 'version' ||
      node.name !== 'navigate'
    ) {
      makeInteractive(node)
    }
  })
}

function makeInteractive(task) {
  if (
    task.name === 'help' ||
    task.name === 'version' ||
    task.name === 'navigate'
  ) {
    return
  }
  debug.log(`Making task "${task.name}" interactive`, 'ui-deep')

  // TODO: Ai doesn't know how to handle flags
  // TODO: This wont really work until I can parse args
  // before extending the environment...
  // Rn it will throw if this flag is used
  // task.addFlag('nonInteractive', 'Disable interactivity', false);

  // Note:
  // The next blocks of code rely on a small change in hardhat/internal/cli/cli.js,
  // that allows this environment extension code to run before hardhat parses cli arguments.
  // Issue: https://github.com/NomicFoundation/hardhat/issues/4950
  // PR: https://github.com/NomicFoundation/hardhat/pull/4951

  // Combine all of the task's parameter definitions in the same array,
  // for the operations that follow.
  const paramDefinitions = task.positionalParamDefinitions.concat(
    Object.values(task.paramDefinitions),
  )

  // Make all parameters optional so that hardhat doesnt
  // throw when required task arguments are not provided.
  // We want to collect them interactively.
  for (let paramDef of paramDefinitions) {
    paramDef.originallyOptional = paramDef.isOptional
    paramDef.isOptional = true
  }

  // Also, intercept parsing of parameters because
  // hardhat automatically injects default values into the action's args.
  // We want to identify when this happens so that we still show prompts
  // with the default value merely suggested instead of directly injected.
  const special = (originalType, paramDef) => ({
    name: 'special',
    parse: (argName, argValue) => {
      const parsedValue = originalType.parse(argName, argValue)
      paramDef.parsedValue = parsedValue
      debug.log(
        `Parsing "${argName}" - Provided: "${argValue}", Default: "${paramDef.defaultValue}", Parsed: "${parsedValue}"`,
        'ui',
      )
      return parsedValue
    },
    validate: (argName, argValue) => {
      return originalType.validate(argName, argValue)
    },
  })
  for (let paramDef of paramDefinitions) {
    debug.log(`  Modifying parser for param "${paramDef.name}"`, 'ui-deep')
    paramDef.originallyOptional = paramDef.isOptional
    paramDef.isOptional = true
    paramDef.type = special(paramDef.type, paramDef)
  }

  // Override the action so that we can
  // collect parameters from the user before runnint it
  const action = async (args, hre, runSuper) => {
    // const { nonInteractive } = args;

    // if (nonInteractive === false) {
    const collectedArgs = await collectArguments(args, task, _hre)
    args = { ...args, ...collectedArgs }

    // If parameters were collected, print out the call
    if (Object.values(collectedArgs).length > 0) {
      output.copyBox(toCliSyntax(args, task), 'Autocompleted')
    }
    // }

    return await runSuper(args, hre, runSuper)
  }

  // Complete the override by calling task()
  // at either the hre or the scope level
  if (task.scope !== undefined) {
    const scope = _hre.scopes[task.scope]
    scope.task(task.name, task.description, action)
  } else {
    hreTask(task.name, task.description, action)
  }
}

function toCliSyntax(args, task) {
  const name = task.scope ? `${task.scope} ${task.name}` : task.name
  const printArgs = Object.entries(args)
    .map(([argName, value]) => {
      const isPositional = task.positionalParamDefinitions.some(
        (p) => p.name === argName,
      )

      if (isPositional) {
        return value
      } else {
        const isFlag = task.paramDefinitions[argName]?.isFlag
        argName = camelToKebabCase(argName)
        if (isFlag) {
          if (value === true) return `--${argName}`
          else return ''
        } else {
          if (value !== undefined) return `--${argName} '${value}'`
          else return ''
        }
      }
    })
    .join(' ')

  return `ethernaut ${name} ${printArgs}`
}
