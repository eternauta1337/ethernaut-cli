const buildToolsSpec = require('./utils/build-tools-spec')
const Assistant = require('./Assistant')
const Action = require('../Action')
const debug = require('ethernaut-common/src/ui/debug')

class Interpreter extends Assistant {
  async initialize(hre) {
    const config = require('./configs/interpreter.json')
    config.tools = buildToolsSpec(hre)

    await super.initialize(hre, 'interpreter', config)

    this.injectAdditionalInstructions(
      hre.config.ethernaut.ai.interpreter.additionalInstructions,
    )

    await this.processFiles(hre.config.ethernaut.ai.interpreter.files)

    this.on('tool_calls_required', this.processToolCalls)

    this.hre = hre
  }

  async processToolCalls(toolCalls) {
    debug.log(`Tool calls required: ${toolCalls.length}`, 'ai')
    debug.log(toolCalls, 'ai-deep')

    const actions = toolCalls.map((tc) => new Action(tc, hre))

    debug.log('Emitting calls_required event', 'ai')

    this.emit('actions_required', actions)
  }
}

module.exports = Interpreter
