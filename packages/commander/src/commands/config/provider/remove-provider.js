const { Command, Argument } = require('commander');
const { storage, onStorageChange } = require('../../../internal/storage');
const logger = require('../../../internal/logger');

const command = new Command();

command
  .name('remove-provider')
  .description('Remove an Ethereum provider')
  .addArgument(
    new Argument('[provider]', 'Provider to remove').choices(
      storage.config.provider.list
    )
  )
  .action(async (provider) => {
    if (!storage.config.provider.list.includes(provider)) {
      logger.error(`${provider} is not a known provider`);
    }

    // Remove
    const index = storage.config.provider.list.indexOf(provider);
    storage.config.provider.list.splice(index, 1);

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

// If anything else changes the list of providers,
// update the choices for this command
onStorageChange(storage.config.provider.list, () => {
  command.registeredArguments
    .find((arg) => arg._name === 'provider')
    .choices(storage.config.provider.list);
});

module.exports = command;
