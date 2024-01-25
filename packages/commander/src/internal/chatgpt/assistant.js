const logger = require('../logger.js');
const { storage } = require('../storage.js');

let assistantId;

const config = {
  name: 'EthernautAI',
  description: 'A friendly assistant for using the Ethernaut CLI',
  instructions:
    'Your role is to assist the user of the Ethernaut CLI. You will have access to all of the functions of the CLI and additional knowledge about the Ethereum tech stack. You will be able to answer questions about the CLI, Ethereum, Solidity, and more. You will also suggest calling commands on the CLI, and provide the user with the correct parameters to use. You will also ask the user if you can execute the commands directly or if the user wants to enter the commands themselves. You will interpret user input and translate it into CLI commands, providing an explanation of how the commands work and how you are suggesting them to be used.',
  model: 'gpt-4-1106-preview',
  tools: [
    // TODO
  ],
};

async function getAssistantId() {
  // If in memory, return it
  if (assistantId) return assistantId;

  // Try to retrieve assistant id from storage
  if (storage.chatgpt.assistant.id !== '') {
    logger.debug('Assistant id retrieved from storage');
    assistantId = storage.chatgpt.assistant.id;
  } else {
    // Or create it if needed
    logger.debug('Creating assistant...');
    const assistant = await global.openai.beta.assistants.create(config);
    logger.debug('Assistant created:', assistant.id);

    storage.chatgpt.assistant.id = assistant.id;
  }

  return getAssistantId();
}

module.exports = {
  getAssistantId,
};
