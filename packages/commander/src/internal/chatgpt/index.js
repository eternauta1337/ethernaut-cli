const { getThreadId } = require('./threads.js');
const { runThread, stopThread } = require('./runner.js');
const logger = require('../logger.js');
const { initOpenAi } = require('./init.js');
const { storage } = require('../storage.js');

async function ask(message) {
  initOpenAi();

  const assistantId = storage.chatgpt.assistant.id;
  if (!assistantId) {
    throw new Error('Assistant not created');
  }
  await logger.debug('Assistant id:', assistantId);

  const threadId = await getThreadId();
  await logger.debug('Thread id:', threadId);

  await stopThread(threadId);

  await global.openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  });

  const response = await runThread(assistantId, threadId);
  await logger.debug(`Responding with: "${response}"`);

  return response;
}

module.exports = {
  ask,
};
