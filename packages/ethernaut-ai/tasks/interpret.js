const { types } = require('hardhat/config');
const ai = require('../scopes/ai');
const Interpreter = require('../internal/assistants/Interpreter');
const Thread = require('../internal/threads/Thread');
const chalk = require('chalk');

ai.task('interpret', 'Interprets natural language into CLI commands')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string
  )
  .addOptionalParam('newThread', 'Start a new thread', false, types.boolean)
  .setAction(async ({ query, newThread }, hre) => {
    const interpreter = new Interpreter(hre);
    const thread = new Thread('default', newThread);

    await thread.stop();
    await thread.post(query);

    const response = await interpreter.process(thread);
    if (!response) return;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log('--------------------------------------');
    console.log(chalk.blue(response));
    console.log('--------------------------------------');
  });
