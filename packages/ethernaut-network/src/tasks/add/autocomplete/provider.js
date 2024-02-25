const { chains } = require('common/src/chains')
const prompt = require('common/src/prompt')

module.exports = async function autocompleteName({ name }) {
  console.log('running autocompleteProvider')
  console.log('name:', name)
  const chain = chains.find((c) => c.name === name)
  const choices = chain.rpc

  return await prompt({
    type: 'autocomplete',
    message: 'Select a provider',
    limit: 15,
    choices,
  })
}
