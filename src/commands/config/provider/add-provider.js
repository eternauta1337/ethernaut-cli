const { Command, Argument } = require('commander');
const { storage } = require('@src/internal/storage');
const { validateURL } = require('@src/internal/validate');
const logger = require('@src/internal/logger');

const command = new Command();

command
  .name('add-provider')
  .description('Add an Ethereum provider')
  .addArgument(new Argument('[provider]', 'Provider to add'))
  .action(async (provider) => {
    // Validate URL
    if (provider === undefined || !validateURL(provider)) {
      logger.error(`${provider} is not a valid URL`);
      return;
    }

    storage.config.provider.list.push(provider);

    logger.output(`<${provider}> added to the list of known providers`);
  });

module.exports = command;