const logger = require('../logger.js');
const { storage } = require('../storage.js');
const crypto = require('crypto');
const { initOpenAi } = require('./init.js');

const config = {
  name: 'EthernautAI',
  description:
    'A friendly assistant for the Ethernaut command line interface program',
  instructions:
    'Your role is to assist the user of the Ethernaut CLI. You will have access to all of the functions of the CLI and additional knowledge about the Ethereum tech stack. You will be able to answer questions about the CLI, Ethereum, Solidity, and more. You will also suggest calling commands on the CLI, and provide the user with the correct parameters to use. You will also ask the user if you can execute the commands directly or if the user wants to enter the commands themselves. You will interpret user input and translate it into CLI commands, providing an explanation of how the commands work and how you are suggesting them to be used.',
  model: 'gpt-4-1106-preview',
};

async function createAssistant({ description, instructions, model, tools }) {
  initOpenAi();

  const finalConfig = {
    name: config.name,
    description: description || config.description,
    instructions: instructions || config.instructions,
    model: model || config.model,
    tools: tools || [],
  };

  // Use a hash to avoid re-creating an existing assistant
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(finalConfig))
    .digest('hex');
  if (storage.chatgpt?.assistant?.hash === hash) {
    await logger.info('Assistant already created');
    return;
  }

  // Create the assistant
  const assistant = await global.openai.beta.assistants.create(finalConfig);
  await logger.debug('Assistant created:', assistant.id);

  // Store it locally
  storage.chatgpt.assistant = {
    hash,
    id: assistant.id,
    config: finalConfig,
  };

  return assistant.id;
}

module.exports = {
  createAssistant,
};
