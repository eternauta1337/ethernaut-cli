const OpenAI = require('openai');

module.exports = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
