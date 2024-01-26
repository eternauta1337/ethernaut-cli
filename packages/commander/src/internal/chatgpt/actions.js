const logger = require('../logger.js');
const { runCommand } = require('../commander/run-command.js');

async function processAction(run, threadId, required_action) {
  const toolCalls = required_action.submit_tool_outputs.tool_calls;

  const toolOutputs = [];

  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;

    logger.info(`ChatGPT requires to call a function: ${functionName}`);

    const argsRaw = JSON.parse(toolCall.function.arguments);
    logger.debug('argsRaw:', JSON.stringify(argsRaw, null, 2));

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

    const output = await runCommand(functionName, args, opts);

    toolOutputs.push({
      tool_call_id: toolCall.id,
      output: output,
    });
  }

  await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
    tool_outputs: toolOutputs,
  });
}

module.exports = {
  processAction,
};
