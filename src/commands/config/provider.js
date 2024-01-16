const { Command, Argument } = require('commander');
const storage = require('@src/internal/storage');
const { validateURL } = require('@src/internal/validate');
const logger = require('@src/internal/logger');

const command = new Command();

command
  .name('provider')
  .description('Set an Ethereum provider')
  .addArgument(
    new Argument('[provider]', 'Provider to set (and remembered)').choices(
      storage.config.provider.list
    )
  )
  .action(async (provider, options) => {
    // Validate URL
    if (provider === undefined || !validateURL(provider)) {
      console.log(`${provider} is not a valid URL`);
      return;
    }

    // Add to list if new
    const isNew = !storage.config.provider.list.includes(provider);
    if (isNew) {
      storage.config.provider.list.push(provider);
    }

    // Set as current
    storage.config.provider.current = provider;

    logger.output(
      `<${provider}> set as the current provider${
        isNew ? ', and added to the list of known providers' : ''
      }`
    );
  });

module.exports = command;
