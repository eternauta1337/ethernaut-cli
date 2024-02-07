const { types } = require('hardhat/config');
const Interpreter = require('../internal/assistants/Interpreter');
const Thread = require('../internal/threads/Thread');
const output = require('common/output');
const spinner = require('common/spinner');

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
    const interpreter = new Interpreter(hre, noPrompt);
    const thread = new Thread('default', newThread);

    spinner.progress('Thinking...', 'ai');

    await thread.stop();
    await thread.post(query);

    const response = await interpreter.process(thread);

    if (response) {
      spinner.remove('ai');
    } else {
      spinner.fail('Interpretation failed', 'ai');
    }

    output.result(response);
  });
