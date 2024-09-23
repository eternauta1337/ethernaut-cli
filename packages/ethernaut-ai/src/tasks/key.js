const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('ethernaut-common/src/io/storage')
const { setEnvVar } = require('ethernaut-common/src/io/env')

require('../scopes/ai')
  .task('key', 'Sets the openai api key')
  .addParam('apiKey', 'The openai api key to use', undefined, types.string)
  .setAction(async ({ apiKey }, hre) => {
    try {
      const config = storage.readConfig()

      let summary = []

      if (apiKey) {
        const currentKey = process.env.OPENAI_API_KEY
        setEnvVar('OPENAI_API_KEY', apiKey)
        summary.push(`- API Key set to ${apiKey} (was ${currentKey})`)
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
