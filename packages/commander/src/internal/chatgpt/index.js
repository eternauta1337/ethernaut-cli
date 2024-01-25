const { getAssistantId } = require('./assistant.js');
const { getThreadId } = require('./threads.js');
// import { runThread, stopThread } from './runner.js';
const logger = require('../logger.js');
const OpenAi = require('openai');

async function ask(message) {
  init();

  const assistantId = await getAssistantId();
  logger.debug('Assistant id:', assistantId);

  const threadId = await getThreadId();
  logger.debug('Thread id:', threadId);

  // await stopThread(threadId);

  await global.openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  });

  // const response = await runThread(assistantId, threadId);
  // logger.log(`Responding with: "${response}"`);

  // return response;
  return `echo ${message}`;
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
