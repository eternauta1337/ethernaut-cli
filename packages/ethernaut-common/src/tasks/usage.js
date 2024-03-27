const { ArgumentsParser } = require('hardhat/internal/cli/ArgumentsParser')

module.exports = function getTaskUsage(task) {
  const scope = task.scope
  const name = task.name
  const paramsList = _getParamsList(task.paramDefinitions)
  const positionalParamsList = _getPositionalParamsList(
    task.positionalParamDefinitions,
  )

  return `${scope} ${name}${paramsList}${positionalParamsList}`
}

function _getParamValueDescription(paramDefinition) {
  return `<${paramDefinition.type.name.toUpperCase()}>`
}

function _getParamsList(paramDefinitions) {
  let paramsList = ''

  for (const name of Object.keys(paramDefinitions).sort()) {
    const definition = paramDefinitions[name]
    const { isFlag, isOptional } = definition

    paramsList += ' '

    if (isOptional) {
      paramsList += '['
    }

    paramsList += `${ArgumentsParser.paramNameToCLA(name)}`

    if (!isFlag) {
      paramsList += ` ${_getParamValueDescription(definition)}`
    }

    if (isOptional) {
      paramsList += ']'
    }
  }

  return paramsList
}

function _getPositionalParamsList(positionalParamDefinitions) {
  let paramsList = ''

  for (const definition of positionalParamDefinitions) {
    const { isOptional, isVariadic, name } = definition

    paramsList += ' '

    if (isOptional) {
      paramsList += '['
    }

    if (isVariadic) {
      paramsList += '...'
    }

    paramsList += name
    paramsList += ' '
    paramsList += _getParamValueDescription(definition)

    if (isOptional) {
      paramsList += ']'
    }
  }

  return paramsList
}
