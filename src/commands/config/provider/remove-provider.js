// // Add to list if new
// const isNew = !storage.config.provider.list.includes(provider);
// if (isNew) {
//   storage.config.provider.list.push(provider);
// }

const { Command, Argument } = require('commander');
const storage = require('@src/internal/storage');
const { validateURL } = require('@src/internal/validate');
const logger = require('@src/internal/logger');

const command = new Command();

command
  .name('remove-provider')
  .description('Remove an Ethereum provider')
  .addArgument(
    new Argument('[provider]', 'Provider to add').choices(
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

    const current = storage.config.provider.current;

    // Remove
    storage.config.provider.list = storage.config.provider.list.filter(
      (item) => item !== provider
    );

    // Try to set current if removed
    if (storage.config.provider.current === provider) {
      if (storage.config.provider.list.length === 0) {
        storage.config.provider.current = undefined;
      } else {
        storage.config.provider.current = storage.config.provider.list[0];
      }
    }

    logger.output(`<${provider}> removed from list of known providers`);
  });

module.exports = command;
