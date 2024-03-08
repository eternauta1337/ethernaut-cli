const camelToKebabCase = require('ethernaut-common/src/kebab')

module.exports = function toCliSyntax(task, args) {
  const tokens = ['ethernaut']
  if (task.scope) tokens.push(task.scope)
  tokens.push(task.name)

  Object.entries(args).forEach(([name, value]) => {
    let isOption
    let paramDef = Object.values(task.paramDefinitions).find(
      (p) => p.name === name,
    )
    if (paramDef) isOption = true
    else paramDef = task.positionalParamDefinitions.find((p) => p.name === name)
    if (!paramDef) {
      throw new Error(`No definition found for parameter ${name}`)
    }

    const isFlag = paramDef.isFlag

    if (isOption) {
      name = `--${camelToKebabCase(name)}`
      if (!isFlag || value === 'true') {
        tokens.push(name)
      }
    }

    if (!isFlag) {
      tokens.push(`${value}`)
    }
  })

  return tokens.join(' ')
}
