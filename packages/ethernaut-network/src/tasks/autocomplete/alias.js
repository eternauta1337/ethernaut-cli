const prompt = require('common/src/prompt')
const storage = require('../../internal/storage')

module.exports = async function autocompleteAlias({ alias }) {
  if (alias) return undefined

  const choices = Object.keys(storage.readNetworks()).filter(
    (alias) => alias !== 'activeNetwork',
  )

  return await prompt({
    type: 'autocomplete',
    message: 'Select a network',
    limit: 15,
    choices,
  })
}
