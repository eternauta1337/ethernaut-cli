const injectCliExplanation = require('./inject-cli-explanation');
const buildToolsSpec = require('./build-tools-spec');

module.exports = function buildInterpreterConfig(common, hre) {
  const config = require('./configs/interpreter.json');

  injectCliExplanation(config, common);
  injectToolsSpec(config, hre);

  return config;
};

function injectToolsSpec(config, hre) {
  config.tools = buildToolsSpec(hre);
}
