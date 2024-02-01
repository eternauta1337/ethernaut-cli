const OpenAi = require('openai');

let openai;

function init() {
  if (openai) return;

  openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function createAssistant(config) {
  init();

  const assistant = await openai.beta.assistants.create(config);

  return assistant.id;
}

module.exports = {
  createAssistant,
};
