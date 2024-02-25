const { chains } = require('common/src/chains')
const prompt = require('common/src/prompt')

module.exports = async function autocompleteName(_) {
  console.log('running autocompleteName')
  const choices = chains.map((c) => c.name)

  return await prompt({
    type: 'autocomplete',
    message: 'Select a network',
    limit: 15,
    choices,
  })
}
