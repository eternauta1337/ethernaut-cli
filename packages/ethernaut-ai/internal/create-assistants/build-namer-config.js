const injectCliExplanation = require('./inject-cli-explanation');

module.exports = function buildNamerConfig(common) {
  const config = require('./configs/namer.json');

  injectCliExplanation(config, common);

  return config;
};
