const prompt = require('ethernaut-common/src/prompt')
const storage = require('ethernaut-wallet/src/internal/storage')

module.exports = (message = 'Select a wallet') => {
  return async function promptAlias() {
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
