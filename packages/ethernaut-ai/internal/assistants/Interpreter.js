const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const TaskCall = require('../TaskCall');
const { Select } = require('enquirer');
const Explainer = require('./Explainer');
const Thread = require('../threads/Thread');
const logger = require('common/logger');
const spinner = require('common/spinner');

class Interpreter extends Assistant {
  constructor(hre, noPrompt = false) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);

    this.noPrompt = noPrompt;
    this.explainer = new Explainer(hre);
  }

  async processToolCalls(toolCalls) {
    const calls = toolCalls.map((tc) => new TaskCall(tc));

    spinner.success('Yey! Assistant knows what to do', 'ai');

    const callsStrings = this.printCalls(calls);

    switch (await this.promptUser()) {
      case 'execute':
        return this.executeCalls(calls, hre);
      case 'explain':
        const userQuery = await this.thread.getLastMessage();
        await this.explain(userQuery, callsStrings);
        return await this.processToolCalls(toolCalls);
      case 'skip':
        return undefined;
    }
  }

  async explain(userQuery, callStrings) {
    const query = `Explain how the last user query would be resolved with the following calls:\n${callStrings.join(
      '\n'
    )}`;

    const secondaryThread = new Thread('explanation');
    await secondaryThread.post(userQuery);
    await secondaryThread.post(query);

    const response = await this.explainer.process(secondaryThread);

    logger.output(response);
  }

  async executeCalls(calls, hre) {
    let outputs = [];

    for (const call of calls) {
      outputs.push(await call.execute(hre));
    }

    return outputs;
  }

  async promptUser() {
    if (this.noPrompt) return 'execute';

    const prompt = new Select({
      message: 'How would you like to proceed?',
      choices: ['execute', 'explain', 'skip'],
    });

    return await prompt.run().catch(() => process.exit(0));
  }

  printCalls(calls) {
    logger.output('The assistant wants to run the following commands:');

    const strings = [];
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const msg = `${i + 1}. \`${call.toCliSyntax()}\``;
      logger.output(msg);
      strings.push(msg);
    }

    return strings;
  }
}

module.exports = Interpreter;
