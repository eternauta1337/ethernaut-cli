module.exports = function setup(hre) {
  const info = hre.scopes.network.tasks.info

  info.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
    require('../params/alias')('Select a network')
}
