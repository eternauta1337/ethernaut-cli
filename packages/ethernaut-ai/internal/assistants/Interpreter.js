const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const Action = require('../Action');
const debug = require('common/debugger');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);

    this.on('tool_calls_required', this.processToolCalls);
  }

  async processToolCalls(toolCalls) {
    debug.log(`Tool calls required: ${toolCalls.length}`, 'ai');
    debug.log(toolCalls, 'ai-deep');

    const actions = toolCalls.map((tc) => new Action(tc));
    const actionStrings = actions.map((a) => a.toCliSyntax());

    debug.log(`Emitting calls_required event`, 'ai');

    this.emit('actions_required', actions, actionStrings);
  }
}

module.exports = Interpreter;
