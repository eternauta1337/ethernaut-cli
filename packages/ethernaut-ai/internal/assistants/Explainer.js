const buildDocs = require('./utils/build-docs');
const Assistant = require('./Assistant');
const Thread = require('../threads/Thread');

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

  async explain(userQuery, callStrings) {
    const query = `Explain how the query "${userQuery}" is addressed with the following actions:\n${callStrings.join(
      '\n'
    )}`;

    const secondaryThread = new Thread('explanation');
    await secondaryThread.stop();
    await secondaryThread.post(query);

    return await this.process(secondaryThread);
  }
}

module.exports = Explainer;
