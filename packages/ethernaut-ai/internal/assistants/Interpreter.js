const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const TaskCall = require('../TaskCall');
// const Explainer = require('./Explainer');
// const Thread = require('../threads/Thread');
// const output = require('common/output');
// const spinner = require('common/spinner');
const debug = require('common/debugger');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);

    // this.noPrompt = noPrompt;
    // this.explainer = new Explainer(hre);
    this.on('tool_calls_required', this.processToolCalls);
  }

  async processToolCalls(toolCalls) {
    debug.log(`Tool calls required: ${toolCalls.length}`, 'ai');
    debug.log(toolCalls, 'ai-deep');

    const calls = toolCalls.map((tc) => new TaskCall(tc));
    const callStrings = calls.map((call) => call.toCliSyntax());

    debug.log(`Emitting calls_required event`, 'ai');
    debug.log(callStrings, 'ai');

    this.emit('calls_required', calls, callStrings);
  }

  // async explain(userQuery, callStrings) {
  //   const query = `Explain how the last user query would be resolved with the following calls:\n${callStrings.join(
  //     '\n'
  //   )}`;

  //   const secondaryThread = new Thread('explanation');
  //   await secondaryThread.post(userQuery);
  //   await secondaryThread.post(query);

  //   const response = await this.explainer.process(secondaryThread);

  //   output.result(response);
  // }
}

module.exports = Interpreter;
