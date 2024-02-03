const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);
  }

  async process(thread) {
    const { action, response } = await super.process(thread);

    // TODO: Parse actions here
    // if (action) {

    // }

    return { action, response };
  }

  async postProcess(output) {
    // Implement your logic here
  }
}

module.exports = Interpreter;
