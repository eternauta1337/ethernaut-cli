const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const TaskCall = require('../TaskCall');
const { Select } = require('enquirer');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);
  }

  async processToolCalls(toolCalls) {
    const calls = toolCalls.map((tc) => new TaskCall(tc));

    this.printCalls(calls);

    switch (await this.promptUser()) {
      case 'execute':
        return this.executeCalls(calls, hre);
      case 'explain':
        // TODO: Implement secondary assistant
        return undefined;
      case 'skip':
        return undefined;
    }
  }

  async executeCalls(calls, hre) {
    let outputs = [];

    for (const call of calls) {
      outputs.push(await call.execute(hre));
    }

    return outputs;
  }

  promptUser() {
    const prompt = new Select({
      message: 'How would you like to proceed?',
      choices: ['execute', 'explain', 'skip'],
    });

    return prompt.run().catch(() => process.exit(0));
  }

  printCalls(calls) {
    console.log('The assistant wants to run the following tasks:');
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      console.log(`${i + 1}. \`${call.toCliSyntax()}\``);
    }
  }
}

module.exports = Interpreter;
