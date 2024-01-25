const { Command } = require('commander');
const { ask } = require('../../internal/chatgpt');
const logger = require('../../internal/logger');

const command = new Command();

command
  .name('assist')
  .description('Ai helper')
  .argument('<query...>', 'Query to ask')
  .action(async (args) => {
    const query = args.join(' ');

    const response = await ask(query);

    logger.output(response);
  });

module.exports = command;
