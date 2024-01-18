const { prompt: enquirerPrompt } = require('enquirer');

async function prompt({ type, message, choices, initial }) {
  let response = await enquirerPrompt({
    type,
    initial,
    name: 'value',
    message,
    choices,
  }).catch(() => {});

  return response ? response.value : undefined;
}

module.exports = { prompt };
