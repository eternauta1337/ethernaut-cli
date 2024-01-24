const { ethers } = require('ethers');
const { storage } = require('./storage');
const logger = require('./logger');

function getProvider() {
  const providerURL = storage.config.provider.current;
  logger.debug('Using provider URL:', providerURL);

  if (providerURL === undefined) {
    throw new Error(
      'Please set a provider first with the command "app config provider"'
    );
  }

  return new ethers.providers.JsonRpcProvider(providerURL);
}

module.exports = {
  getProvider,
};
