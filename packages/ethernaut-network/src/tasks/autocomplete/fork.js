const prompt = require('common/src/prompt')
const storage = require('../../internal/storage')

module.exports = async function autocompleteFork({ fork }) {
  if (fork) return undefined

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
