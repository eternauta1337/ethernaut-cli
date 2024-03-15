const types = require('ethernaut-common/src/types')
const output = require('ethernaut-common/src/output')
const storage = require('ethernaut-common/src/storage')

require('../scopes/ai')
  .task('config', 'Configures ai scope parameters')
  .addParam('model', 'The openai model to use', undefined, types.string)
  .setAction(async ({ model }, hre) => {
    try {
      const config = storage.readConfig()

      let summary = []

      if (model && model !== config.ai.model) {
        summary.push(`- Model set to ${model} (was ${config.ai.model})`)
        config.ai.model = model
        hre.config.ethernaut.ai.model = model
      }

      storage.saveConfig(config)

      if (summary.length === 0) {
        summary.push('No changes')
      }

      return output.resultBox(summary.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
