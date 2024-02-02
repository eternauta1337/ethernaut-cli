const injectCliExplanation = require('./inject-cli-explanation');
const buildDocs = require('./build-docs');

module.exports = function buildExplainerConfig(common, hre) {
  const config = require('./configs/explainer.json');

  injectCliExplanation(config, common);
  injectDocs(config, hre);

  return config;
};

function injectDocs(config, hre) {
  const docs = buildDocs(hre);

  config.instructions = config.instructions.replace(
    '[task-docs]',
    docs.join('\n')
  );
}
