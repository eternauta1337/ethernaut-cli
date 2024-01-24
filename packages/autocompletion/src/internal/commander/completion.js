const autocomplete = require('../prompts/autocomplete');
const { suggest } = require('./suggest');

async function completion(command) {
  const answer = await autocomplete({
    message: '$',
    suggestOnly: true,
    source: suggest(command),
  });

  return answer;
}

module.exports = {
  completion,
};
