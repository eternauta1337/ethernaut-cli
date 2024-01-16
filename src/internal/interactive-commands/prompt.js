const { prompt: enquirerPrompt } = require('enquirer');

async function prompt({ type, message, choices }) {
  let response = await enquirerPrompt({
    type,
    name: 'value',
    message,
    choices,
  });

  if (response.value === undefined) {
    process.exit(0);
  }

  return response.value;
}

module.exports = { prompt };
