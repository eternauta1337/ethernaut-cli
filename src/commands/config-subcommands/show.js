const { Command } = require('commander');
const storage = require('../../utils/storage');
const logger = require('../../utils/logger');

const command = new Command();

command
  .name('show')
  .description('Show all current config properties')
  .action(async () => {
    logger.info(`\nCurrent provider: ${storage.config.provider.current}`);
  });

module.exports = command;
