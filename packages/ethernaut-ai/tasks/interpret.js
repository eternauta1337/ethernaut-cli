const { types } = require('hardhat/config');
const ai = require('../scopes/ai');
const Interpreter = require('../internal/assistants/Interpreter');
const Thread = require('../internal/threads/Thread');

ai.task('interpret', 'Interprets natural language into CLI commands')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string
  )
  .setAction(async ({ query }, hre) => {
    const interpreter = new Interpreter(hre);
    const thread = new Thread();

    await thread.stop();
    await thread.post(query);

    const response = await interpreter.process(thread);

    if (response) {
      console.log(response);
    }
  });
