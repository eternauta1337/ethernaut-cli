const { types } = require('hardhat/config');
const ai = require('../scopes/ai');
const Interpreter = require('../internal/assistants/Interpreter');
const Thread = require('../internal/threads/Thread');
const { Select } = require('enquirer');

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

    // Post the query in the thread
    await thread.post(query);

    // Let the interpreter convert it to cli commands
    const { actions, response } = await interpreter.process(thread);

    // Only a text response?
    // Show it and exit
    if (response) {
      console.log(response);
      return;
    }

    // Ai wants to run some commands...
    await processActions(actions, thread, hre);
  });

async function processActions(actions, thread, hre) {
  console.log('The assistant wants to run the following actions:');
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(`${i + 1}. \`${action.toString()}\``);
  }

  const prompt = new Select({
    message: 'How would you like to proceed?',
    choices: ['execute', 'explain', 'skip'],
  });

  const response = await prompt.run().catch(() => process.exit(0));

  // Let the user decide wether
  // to run it, skip it, or explain it
  switch (response) {
    case 'execute':
      // Run the commands and collect the cli output
      let outputs = [];
      for (const action of actions) {
        outputs.push(await action.execute(hre));
      }
      console.log(outputs);
      // Let the interpreter have a look at the output
      // to produce a final interpretation
      // response = await interpreter.postProcess(outputs);
      // console.log(response);
      break;
    case 'explain':
      // // Post the commands in the thread
      // await thread.post(action);
      // // Let the explainer run the thread
      // response = await explainer.process(action, thread);
      // console.log(response);
      // // And let the user choose
      // // how to continue once more
      // await processAction(action);
      break;
    default:
      // Just skip
      break;
  }
}
