const buildDocs = require('./utils/build-docs')
const Assistant = require('./Assistant')
const Thread = require('../threads/Thread')

class Explainer extends Assistant {
  constructor(hre) {
    const config = require('./configs/explainer.json')

    const docs = buildDocs(hre)
    config.instructions = config.instructions.replace(
      '[task-docs]',
      docs.join('\n'),
    )

    super('explainer', config)

    this.injectAdditionalInstructions(
      hre.config.ethernaut.ai.explainer.additionalInstructions,
    )
  }

  async explain(userQuery, action) {
    const query = `Explain how the query "${userQuery}" is addressed with the following action:\n${action}`

    const secondaryThread = new Thread('explanation')
    await secondaryThread.stop()
    await secondaryThread.post(query)

    return await this.process(secondaryThread)
  }
}

module.exports = Explainer
