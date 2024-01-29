const logger = require('../logger.js');
const { prompt } = require('../interactive/prompt');
const { parseCommand, runCommand } = require('../commander/run-command.js');

async function processAction(run, threadId, required_action) {
  const toolCalls = required_action.submit_tool_outputs.tool_calls;

  logger.info(
    `The assistant wants to call ${toolCalls.length} command${
      toolCalls.length === 1 ? '' : 's'
    }:`
  );

  // Build the calls
  const tokenizedCalls = [];
  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;

    // logger.info(`ChatGPT requires to call a function: ${functionName}`);

    const argsRaw = JSON.parse(toolCall.function.arguments);
    // logger.debug('argsRaw:', JSON.stringify(argsRaw, null, 2));

    // Differentiate arguments from options
    const args = [];
    const opts = {};
    for (const argName in argsRaw) {
      // Option
      if (argName.startsWith('_')) {
        opts[argName.substring(1)] = argsRaw[argName];
      } else {
        // Argument
        args.push(argsRaw[argName]);
      }
    }

    const tokens = parseCommand(functionName, args, opts);

    tokenizedCalls.push({
      id: toolCall.id,
      tokens,
    });

    logger.info(`${tokenizedCalls.length}. ${tokens.join(' ')}`);
  }

  // Confirm
  const choice = await showConfirmPrompt();
  if (choice === 'No') return true;
  if (choice === 'Edit') logger.info('Feature not available yet');
  if (choice === 'Explain') logger.info('Feature not available yet');

  // Do the calls
  logger.info('Calling the commands...');
  const toolOutputs = [];
  for (const call of tokenizedCalls) {
    const output = await runCommand(call.tokens);

    toolOutputs.push({
      tool_call_id: call.id,
      output: output,
    });
  }

  logger.info('Analyzing the results...');
  await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
    tool_outputs: toolOutputs,
  });

  return false;
}

async function showConfirmPrompt() {
  const result = await prompt({
    type: 'select',
    message: 'Do you want to run the commands?',
    name: 'value',
    choices: [
      {
        title: 'Yes',
        value: 0,
      },
      {
        title: 'No',
        value: 1,
      },
      {
        title: 'Edit',
        value: 2,
      },
      {
        title: 'Explain',
        value: 3,
      },
    ],
  });

  return result;
}

module.exports = {
  processAction,
};
