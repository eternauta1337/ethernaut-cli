const { types } = require('hardhat/config');
const Interpreter = require('../internal/assistants/Interpreter');
const Explainer = require('../internal/assistants/Explainer');
const Thread = require('../internal/threads/Thread');
const output = require('common/output');
const debug = require('common/debugger');
const spinner = require('common/spinner');
const { Select } = require('enquirer');

let _noConfirm;
let _thread;
let _interpreter;
let _explainer;
let _query;

require('../scopes/ai')
  .task('interpret', 'Interprets natural language into CLI commands')
  .addOptionalPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string
  )
  .addFlag('noConfirm', 'Always execute the command without prompting')
  .addFlag('newThread', 'Start a new thread')
  .setAction(async ({ query, newThread, noConfirm }, hre) => {
    try {
      _noConfirm = noConfirm;
      _query = query;

      spinner.progress('Preparing thread...', 'ai');
      _thread = new Thread('default', newThread);
      await _thread.stop();

      spinner.progress('Posting query...', 'ai');
      await _thread.post(query);

      const statusUpdateListener = (status) =>
        spinner.progress(`Thinking... (${status})`, 'ai');
      const buildingAssistantLIstener = () =>
        spinner.progress('Building assistant...', 'ai');

      _interpreter = new Interpreter(hre);
      _interpreter.on('actions_required', processActions);
      _interpreter.on('status_update', statusUpdateListener);
      _interpreter.on('building_assistant', buildingAssistantLIstener);

      _explainer = new Explainer(hre);
      _explainer.on('status_update', statusUpdateListener);
      _explainer.on('building_assistant', buildingAssistantLIstener);

      spinner.progress('Thinking...', 'ai');
      const response = await _interpreter.process(_thread);

      spinner.success('Assistant response:', 'ai');
      output.result(response);
    } catch (err) {
      debug.log(err, 'ai');
      output.problem(err.message);
    }
  });

async function processActions(actions, actionStrings) {
  debug.log(`Calls required: ${actionStrings}`, 'ai');

  spinner.success('The assistant wants to run some actions', 'ai');
  actionStrings.forEach(output.info);

  switch (await promptUser()) {
    case 'execute':
      spinner.progress('Executing...', 'ai');
      const outputs = [];
      for (let action of actions) {
        outputs.push(await action.execute(hre));
      }
      spinner.progress('Analyzing...', 'ai');
      await _interpreter.reportToolOutputs(outputs);
      break;
    case 'explain':
      spinner.progress('Analyzing...', 'ai');
      output.info(await _explainer.explain(_query, actionStrings));
      processActions(actions, actionStrings);
      break;
    case 'skip':
      spinner.progress('Exiting...', 'ai');
      await _interpreter.reportToolOutputs(undefined);
      break;
  }
}

async function promptUser() {
  if (_noConfirm) return 'execute';

  const prompt = new Select({
    message: 'How would you like to proceed?',
    choices: ['execute', 'explain', 'skip'],
  });

  return await prompt.run().catch(() => process.exit(0));
}
