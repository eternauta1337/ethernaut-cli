const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const Action = require('../Action');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);
  }

  async requireToolCalls(toolCalls, thread, run) {
    const actions = toolCalls.map((tc) => new Action(tc));

    return await super.requireToolCalls(actions, thread, run);
  }
}

module.exports = Interpreter;
