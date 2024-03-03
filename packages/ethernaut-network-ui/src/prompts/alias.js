const prompt = require('common/src/prompt')
const storage = require('ethernaut-network/src/internal/storage')

module.exports = function promptAlias(message = 'Select a network') {
  return async function promptAlias() {
    const choices = Object.keys(storage.readNetworks()).filter(
      (alias) => alias !== 'activeNetwork',
    )
    return await prompt({
      type: 'autocomplete',
      message,
      limit: 15,
      choices,
    })
  }
}
