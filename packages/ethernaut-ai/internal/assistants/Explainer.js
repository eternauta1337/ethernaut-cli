const buildDocs = require('./utils/build-docs');
const Assistant = require('./Assistant');

class Explainer extends Assistant {
  constructor(hre) {
    const config = require('./configs/explainer.json');

    const docs = buildDocs(hre);
    config.instructions = config.instructions.replace(
      '[task-docs]',
      docs.join('\n')
    );

    super('explainer', config);
  }
}

module.exports = Explainer;
