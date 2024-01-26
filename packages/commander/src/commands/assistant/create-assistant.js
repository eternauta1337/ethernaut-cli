const { Command } = require('commander');
const {
  buildToolsSpec,
} = require('../../internal/chatgpt-commander/build-tools-spec');
const { createAssistant } = require('../../internal/chatgpt/assistant');
const logger = require('../../internal/logger');

const command = new Command();

command
  .name('create-assistant')
  .description('Creates a new assistant')
  .action(async () => {
    const tools = buildToolsSpec(command);
    // console.log(JSON.stringify(tools, null, 2));

    const assistantId = await createAssistant({ tools });

    if (assistantId) {
      logger.output(`Assistant created: <${assistantId}>`);
    }
  });

module.exports = command;
