module.exports = function setup(hre) {
  const info = hre.scopes.wallet.tasks.info

  info.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
    require('../params/alias')('Select a wallet')
}
