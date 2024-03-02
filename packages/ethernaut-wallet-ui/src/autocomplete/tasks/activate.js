module.exports = function setup(hre) {
  const activate = hre.scopes.wallet.tasks.activate

  activate.positionalParamDefinitions.find(
    (p) => p.name === 'alias',
  ).autocomplete = require('../params/alias')('Select a wallet to activate')
}
