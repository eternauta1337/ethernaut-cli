module.exports = function setup(hre) {
  const remove = hre.scopes.wallet.tasks.remove

  remove.positionalParamDefinitions.find(
    (p) => p.name === 'alias',
  ).autocomplete = require('../params/alias')('Select a wallet to remove')
}
