const debug = require('common/src/debug')
const camelToKebabCase = require('common/src/kebab')
const chalk = require('chalk')

class Action {
  /**
   * Incoming toolCall is an object with the following structure:
   * {
   *   id: '...',
   *   function: {
   *     name: '...',
   *     arguments: '{"value":"...", "fix":"..."}'
   *   }
   * }
   */
  constructor(toolCall, hre) {
    this.hre = hre
    this.id = toolCall.id
    this.function = toolCall.function
    this.parseTask()
    this.parseArgs()
  }

  parseTask() {
    const nameComponents = this.function.name.split('.')

    if (nameComponents.length === 1) {
      this.taskName = nameComponents[0]
    } else {
      this.scopeName = nameComponents[0]
      this.taskName = nameComponents[1]
    }

    if (this.scopeName) {
      this.scope = this.hre.scopes[this.scopeName]
      this.task = this.scope.tasks[this.taskName]
    } else {
      this.task = this.hre.tasks[this.taskName]
    }
  }

  parseArgs() {
    this.args = JSON.parse(this.function.arguments)
    Object.entries(this.args).forEach(([name, value]) => {
      value = value === 'true' ? true : value
      value = value === 'false' ? false : value
      this.args[name] = value
    })
  }

  async execute(hre, noConfirm = false) {
    let collectedOutput = ''

    if (noConfirm) {
      this.args.noConfirm = true
    }

    if (this.scopeName) {
      debug.log(
        `Calling: ${this.scopeName} ${this.taskName} ${JSON.stringify(
          this.args,
          null,
          2,
        )}`,
        'ai',
      )
      collectedOutput += await hre.run(
        { scope: this.scopeName, task: this.taskName },
        this.args,
      )
    } else {
      debug.log(
        `Calling: ${this.taskName} ${JSON.stringify(this.args, null, 2)}`,
        'ai',
      )
      collectedOutput += await hre.run(this.taskName, this.args)
    }

    return {
      tool_call_id: this.id,
      output: collectedOutput,
    }
  }

  getDescription() {
    const cliSyntax = this.toCliSyntax()
    const description = chalk.dim(
      `"${this.taskName}" task: ${this.task.description}`,
    )

    return `${cliSyntax}\n${description}`
  }

  /**
   * Converts the tool call to cli syntax like '<scope> <task> --option1 "value1" --option2 "value2"'
   */
  toCliSyntax() {
    // Function name can be '<scope>.<task>' or just '<task>
    // For print out, replace '.' with ' '.
    const name = this.function.name.replace('.', ' ')
    debug.log(`Building cli syntax for ${name}`, 'ai')
    debug.log(
      `OpenAI function: ${JSON.stringify(this.function, null, 2)}`,
      'ai',
    )

    // The first token is task name (with scope if present)
    const tokens = ['ethernaut', name]

    // Arguments and options are mixed in the tool call definition,
    // but option names are marked starting with an underscore.
    const argsAndOpts = JSON.parse(this.function.arguments)
    Object.entries(argsAndOpts).forEach(([name, value]) => {
      let isOption
      let paramDef = Object.values(this.task.paramDefinitions).find(
        (p) => p.name === name,
      )
      if (paramDef) isOption = true
      else
        paramDef = this.task.positionalParamDefinitions.find(
          (p) => p.name === name,
        )
      if (!paramDef) {
        throw new Error(`No definition found for parameter ${name}`)
      }

      debug.log(`Processing ${name}=${value}`, 'ai')
      const isFlag = paramDef.isFlag
      debug.log(`isOption: ${isOption}, isFlag: ${isFlag}`, 'ai')

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
    debug.log(`Tokens: ${tokens}`, 'ai')

    return tokens.join(' ')
  }
}

module.exports = Action
