const prompt = require('common/src/prompt')
const storage = require('../../internal/storage')

module.exports = (message = 'Select a signer') => {
  return async function autocompleteAlias({ alias }) {
    if (alias) return undefined

    const choices = Object.keys(storage.readSigners()).filter(
      (alias) => alias !== 'activeSigner',
    )

    return await prompt({
      type: 'autocomplete',
      message,
      limit: 15,
      choices,
    })
  }
}
