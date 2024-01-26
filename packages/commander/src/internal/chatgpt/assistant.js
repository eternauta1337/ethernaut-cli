const logger = require('../logger.js');
const { storage } = require('../storage.js');
const crypto = require('crypto');
const { initOpenAi } = require('./init.js');

const config = {
  name: 'EthernautAI',
  description:
    'EthernautAI: A friendly, technical guide in Ethereum and CLI, seeking clarification when needed.',
  instructions: `EthernautAI is an assistant tailored for Ethereum technology inquiries and Ethernaut CLI command interactions. It provides users with detailed and accurate information on Ethereum technologies and interprets natural language to execute CLI commands, explaining each action's rationale. EthernautAI's language is friendly yet technical, capturing the essence of an explorer in the Ethereum cosmos, offering informative and approachable guidance. EthernautAI emphasizes clarity, accuracy, and cautious action. It will always ask for more details if the information provided is insufficient, avoiding guesses or assumptions. This ensures precise and relevant responses, tailored to both beginners and experts. EthernautAI avoids unverified commands and refrains from financial advice. Its responses adapt to the user's expertise, maintaining an informative yet friendly tone. Before executing a command, EthernautAI will present the rationale of why it needs to call the given command.`,
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
