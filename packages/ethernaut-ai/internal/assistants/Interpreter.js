const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);
  }

  async process(thread) {
    let actions, response;

    ({ actions, response } = await super.process(thread));

    if (actions) {
      actions = actions.map((action) => this.parseAction(action));
    }

    return { actions, response };
  }

  async postProcess(output) {
    // Implement your logic here
  }

  // Converts an openai function call to a shell call.
  // E.g.
  // from: { name: 'to-bytes', arguments: '{"value":"poop", "_fix":"true"}' }
  // to: [ "to-bytes", "poop", "--fix", "true" ]
  parseAction(action) {
    // Options are mixed with arguments but start with underscore.
    const argsAndOpts = JSON.parse(action.arguments);

    const tokens = [action.name];

    Object.entries(argsAndOpts).forEach(([name, value]) => {
      const isOption = name.includes('_');

      if (isOption) {
        name = name.substring(1); // Remove underscore
        tokens.push(`--${name}`);
      }

      tokens.push(`${value}`);
    });

    return tokens;
  }
}

module.exports = Interpreter;
