const { types } = require('hardhat/config');
const ai = require('../scopes/ai');
const { updateAssistants } = require('../internal/update-assistants');

ai.task('interpret', 'Interprets natural language into CLI commands')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string
  )
  .setAction(async ({ query }, hre) => {
    await updateAssistants(hre);

    console.log('Interpreting:', query);
  });
