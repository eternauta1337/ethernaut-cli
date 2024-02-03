const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const Action = require('../Action');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);
  }

  async process(thread) {
    let actions, response;

    // ({ actions, response } = await super.process(thread));
    actions = [{ name: 'tools:to-bytes', arguments: '{"value":"SNX"}' }];

    if (actions) {
      actions = actions.map((a) => new Action(a));
    }

    return { actions, response };
  }

  async postProcess(output) {
    // Implement your logic here
  }
}

module.exports = Interpreter;
