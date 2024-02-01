const { types } = require('hardhat/config');
const ai = require('../scopes/ai');

ai.task('interpret', 'Interprets natural language into CLI commands')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string
  )
  .setAction(async ({ query }) => {
    console.log('Interpreting:', query);
  });
