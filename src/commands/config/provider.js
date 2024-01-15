const { Command, Argument } = require('commander');
const prompts = require('prompts');
const storage = require('../../internal/storage');
const { validateURL } = require('../../internal/validate');
const logger = require('../../internal/logger');

const command = new Command();

command
  .name('provider')
  .description('Set an Ethereum provider')
  .argument('<provider*>', 'Provider to set (and remember)')
  .action(async (provider, options) => {
    // Suggest if empty
    if (provider === undefined && options.interactive) {
      provider = await pickProviderFromList();
    }
    // console.log('Picked:', provider);

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

async function pickProviderFromList() {
  const choices = storage.config.provider.list.map((provider) => ({
    title: provider,
  }));

  let userInput = '';

  result = await prompts([
    {
      type: 'autocomplete',
      name: 'selected',
      message: 'Pick or enter a provider',
      fallback: 'No matches found - Press enter to add as new provider',
      suggest: async (text) => {
        if (!text) return choices;
        userInput = text;
        return choices.filter((choice) => choice.title.includes(text));
      },
      choices,
    },
  ]);

  return result.selected || userInput;
}

module.exports = command;
