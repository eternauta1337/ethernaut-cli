const OpenAi = require('openai');

function initOpenAi() {
  if (global.openai) return;

  global.openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

module.exports = {
  initOpenAi,
};
