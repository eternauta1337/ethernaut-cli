const { types } = require('hardhat/config');
const Interpreter = require('../internal/assistants/Interpreter');
const Explainer = require('../internal/assistants/Explainer');
const Thread = require('../internal/threads/Thread');
const output = require('common/output');
const debug = require('common/debugger');
const { Select } = require('enquirer');

let _noPrompt;
let _thread;
let _interpreter;
let _explainer;
let _query;

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
      _noPrompt = noPrompt;
      _query = query;

      _thread = new Thread('default', newThread);
      await _thread.post(query);

      _explainer = new Explainer(hre);

      _interpreter = new Interpreter(hre);
      _interpreter.on('calls_required', processCalls);

      const response = await _interpreter.process(_thread);

      output.result(response);
    } catch (err) {
      debug.log(err, 'ai');
      output.problem(err.message);
    }
  });

// TODO: Rename to processActions
async function processCalls(calls, callStrings) {
  debug.log(`Calls required: ${callStrings}`, 'ai');
  // spinner.success('The assistant wants to run some actions', 'ai');

  output.info('The assistant wants to run some actions:');
  callStrings.forEach(output.info);

  switch (await promptUser()) {
    case 'execute':
      const outputs = [];
      for (let call of calls) {
        outputs.push(await call.execute(hre));
      }
      await _interpreter.reportToolOutputs(outputs);
      break;
    case 'explain':
      const response = await _explainer.explain(_query, callStrings);
      output.info(response);
      processCalls(calls, callStrings);
      break;
    case 'skip':
      await _interpreter.reportToolCalls(undefined);
      break;
  }
}

async function promptUser() {
  if (_noPrompt) return 'execute';

  const prompt = new Select({
    message: 'How would you like to proceed?',
    choices: ['execute', 'explain', 'skip'],
  });

  return await prompt.run().catch(() => process.exit(0));
}
