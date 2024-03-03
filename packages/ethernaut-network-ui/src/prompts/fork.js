const prompt = require('common/src/prompt')
const storage = require('ethernaut-network/src/internal/storage')

module.exports = async function promptFork({ fork, paramDefault }) {
  const valueProvided = fork !== undefined
  const isDefault = fork === paramDefault

  // No need to prompt?
  if (valueProvided && !isDefault) return fork

  const choices = ['none'].concat(
    Object.keys(storage.readNetworks()).filter(
      (alias) => alias !== 'activeNetwork',
    ),
  )

  return await prompt({
    type: 'autocomplete',
    message: 'Select a network to fork',
    limit: 15,
    choices,
  })
}
