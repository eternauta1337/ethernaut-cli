module.exports = function setup(hre) {
  const info = hre.scopes.wallet.tasks.info

  info.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    require('../params/alias')('Select a wallet')
}
