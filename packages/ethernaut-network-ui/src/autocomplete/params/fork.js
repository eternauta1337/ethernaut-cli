const prompt = require('common/src/prompt')
const storage = require('ethernaut-network/src/internal/storage')

module.exports = async function autocompleteFork({ fork, paramDefault }) {
  const valueProvided = fork !== undefined
  const isDefault = fork === paramDefault

  // No need to autocomplete?
  if (valueProvided && !isDefault) return undefined

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
