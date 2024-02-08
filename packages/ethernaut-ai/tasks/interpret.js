const { types } = require('hardhat/config');
const Interpreter = require('../internal/assistants/Interpreter');
const Thread = require('../internal/threads/Thread');
const output = require('common/output');
const debug = require('common/debugger');

require('../scopes/ai')
  .task('interpret', 'Interprets natural language into CLI commands')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string
  )
  .addFlag('noPrompt', 'Always execute the command without prompting')
  .addFlag('newThread', 'Start a new thread')
  .setAction(async ({ query, newThread, noPrompt }, hre) => {
    try {
      const thread = new Thread('default', newThread);
      await thread.post(query);

      const interpreter = new Interpreter(hre, noPrompt);
      interpreter.on('action_required', async () => {});

      const response = await interpreter.process(thread);

      output.result(response);
    } catch (err) {
      debug.log(err, 'ai');
      output.problem(err.message);
    }
  });
