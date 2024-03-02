const prompt = require('common/src/prompt')
const storage = require('ethernaut-network/src/internal/storage')

module.exports = function setup(hre) {
  const activate = hre.scopes.network.tasks.activate

  activate.positionalParamDefinitions.find(
    (p) => p.name === 'alias',
  ).autocomplete = autocompleteAlias('Select a network to activate')
}

function autocompleteAlias(message = 'Select a network') {
  return async function autocompleteAlias({ alias }) {
    if (alias) return undefined
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
