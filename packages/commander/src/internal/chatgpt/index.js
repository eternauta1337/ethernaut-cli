const { getAssistantId } = require('./assistant.js');
const { getThreadId } = require('./threads.js');
const { runThread, stopThread } = require('./runner.js');
const logger = require('../logger.js');
const OpenAi = require('openai');

async function ask(message) {
  init();

  const assistantId = await getAssistantId();
  await logger.debug('Assistant id:', assistantId);

  const threadId = await getThreadId();
  await logger.debug('Thread id:', threadId);

  // await stopThread(threadId);

  await global.openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  });

  const response = await runThread(assistantId, threadId);
  await logger.debug(`Responding with: "${response}"`);

  return response;
}

function init() {
  if (global.openai) return;

  global.openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

module.exports = {
  ask,
};
