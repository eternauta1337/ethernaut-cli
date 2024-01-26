const { prompt: enquirerPrompt } = require('enquirer');

async function prompt({ type, message, choices, initial }) {
  // console.log('Prompt:', type, message, choices, initial);
  let response = await enquirerPrompt({
    type,
    initial,
    name: 'value',
    message,
    choices,
    limit: 10,
  }).catch((err) => {
    // console.log('Prompt cancelled', err);
  });

  return response ? response.value : undefined;
}

module.exports = { prompt };
