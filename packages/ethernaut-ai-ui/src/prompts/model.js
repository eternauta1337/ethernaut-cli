const prompt = require('ethernaut-common/src/prompt')
const openai = require('ethernaut-ai/src/internal/openai')
const checkEnvVar = require('ethernaut-common/src/check-env')

module.exports = async function promptModel() {
  await checkEnvVar(
    'OPENAI_API_KEY',
    'This is required by the ai package to interact with the openai assistants API.',
  )

  const list = await openai().models.list()
  const choices = list.body.data.map((model) => model.id)

  return await prompt({
    type: 'autocomplete',
    message: 'Select a model',
    limit: 15,
    choices,
  })
}
