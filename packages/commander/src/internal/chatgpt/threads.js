const logger = require('../logger.js');
const { storage } = require('../storage.js');

let threadId;

async function getThreadId() {
  // If in memory, return it
  if (threadId) {
    return threadId;
  }

  // Try to retrieve thread id from storage
  if (storage.chatgpt.thread) {
    logger.debug(
      'Thread id retrieved from storage:',
      storage.chatgpt.thread.id
    );
    threadId = storage.chatgpt.thread.id;
  } else {
    // Or create it if needed
    logger.debug('Creating thread...');
    const thread = await global.openai.beta.threads.create();
    logger.debug('Thread created:', thread.id);

    storage.chatgpt.thread = {
      id: thread.id,
    };
  }

  return getThreadId();
}

module.exports = {
  getThreadId,
};
