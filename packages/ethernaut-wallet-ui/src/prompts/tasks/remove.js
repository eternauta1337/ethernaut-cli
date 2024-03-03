module.exports = function setup(hre) {
  const remove = hre.scopes.wallet.tasks.remove

  remove.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    require('../params/alias')('Select a wallet to remove')
}
