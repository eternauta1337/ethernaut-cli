const camelToKebabCase = require('ethernaut-common/src/util/kebab')
const debug = require('ethernaut-common/src/ui/debug')

module.exports = function toCliSyntax(task, args) {
  debug.log(
    `Converting to CLI syntax: ${task.name}, args: ${JSON.stringify(args)}`,
    'common',
  )

  const tokens = ['ethernaut']
  if (task.scope) tokens.push(task.scope)
  tokens.push(task.name)

  Object.entries(args).forEach(([name, value]) => {
    if (value === undefined) return

    let isOption
    let paramDef = Object.values(task.paramDefinitions).find(
      (p) => p.name === name,
    )
    if (paramDef) isOption = true
    else paramDef = task.positionalParamDefinitions.find((p) => p.name === name)
    if (!paramDef) {
      throw new Error(
        `No definition found for parameter ${name}, and task ${task.name}, with args ${JSON.stringify(args, null, 2)}`,
      )
    }

    const isFlag = paramDef.isFlag

    if (isOption) {
      name = `--${camelToKebabCase(name)}`
      if (!isFlag || value === 'true') {
        tokens.push(name)
      }
    }

    if (!isFlag) {
      const regex = /[ '"?*&|()<>;{}!$]/
      const needsQuotes = regex.test(value)
      if (needsQuotes) {
        tokens.push(`'${value}'`)
      } else {
        tokens.push(`${value}`)
      }
    }
  })

  return tokens.join(' ')
}
