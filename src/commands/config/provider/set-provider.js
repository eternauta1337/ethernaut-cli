const { Command, Argument } = require('commander');
const storage = require('@src/internal/storage');
const { validateURL } = require('@src/internal/validate');
const logger = require('@src/internal/logger');

const command = new Command();

command
  .name('set-provider')
  .description('Set an Ethereum provider')
  .addArgument(
    new Argument('[provider]', 'Provider to set').choices(
      storage.config.provider.list
    )
  )
  .action(async (provider) => {
    // Validate URL
    if (provider === undefined || !validateURL(provider)) {
      logger.error(`${provider} is not a valid URL`);
      return;
    }

    if (!storage.config.provider.list.includes(provider)) {
      logger.error(`${provider} is not a known provider`);
    }

    // Set as current
    storage.config.provider.current = provider;

    logger.output(`<${provider}> set as the current provider`);
  });

module.exports = command;
